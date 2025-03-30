import { TableData } from '../types';

// Cache interface
interface CacheEntry {
  data: TableData;
  timestamp: number;
  lastAccessed: number;
}

// Cache configuration
const CACHE_SIZE = 5; // Maximum number of tables to keep in cache


// In-memory cache
const cache: Map<string, CacheEntry> = new Map();

// Helper function to parse CSV string
const parseCSV = (csvText: string): TableData => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Pre-allocate array for better performance
  const rows: string[][] = new Array(lines.length - 1);
  
  // Parse rows in parallel using chunks
  const chunkSize = 100; // Process 100 rows at a time
  for (let i = 1; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, Math.min(i + chunkSize, lines.length));
    chunk.forEach((line, index) => {
      if (line.trim()) {
        rows[i - 1 + index] = line.split(',').map(cell => cell.trim());
      }
    });
  }
  
  // Filtering  empty rows
  const validRows = rows.filter(row => row && row.length > 0);
  
  return {
    headers,
    rows: validRows
  };
};

// Function to load and parse CSV file
export const loadCSV = async (tableName: string): Promise<TableData> => {
  // Check cache first
  const cachedEntry = cache.get(tableName);
  if (cachedEntry) {
    // Update last accessed time
    cachedEntry.lastAccessed = Date.now();
    return cachedEntry.data;
  }

  try {
    const response = await fetch(`/${tableName}.csv`);
    if (!response.ok) {
      throw new Error(`Failed to load ${tableName}.csv`);
    }
    
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);

    // Manage cache size
    if (cache.size >= CACHE_SIZE) {
      // Remove least recently accessed entry
      let oldestEntry = { key: '', timestamp: Infinity };
      for (const [key, entry] of cache.entries()) {
        if (entry.lastAccessed < oldestEntry.timestamp) {
          oldestEntry = { key, timestamp: entry.lastAccessed };
        }
      }
      cache.delete(oldestEntry.key);
    }

    // Add to cache
    cache.set(tableName, {
      data: parsedData,
      timestamp: Date.now(),
      lastAccessed: Date.now()
    });

    return parsedData;
  } catch (error) {
    console.error(`Error loading CSV for ${tableName}:`, error);
    throw error;
  }
};

// Function to clear cache
export const clearCache = () => {
  cache.clear();
};

// Function to get cache statistics
export const getCacheStats = () => {
  return {
    size: cache.size,
    tables: Array.from(cache.keys()),
    entries: Array.from(cache.entries()).map(([key, entry]) => ({
      table: key,
      timestamp: entry.timestamp,
      lastAccessed: entry.lastAccessed,
      rowCount: entry.data.rows.length
    }))
  };
};

// Function to execute a simple query on cached data
export const executeQuery = async (query: string): Promise<TableData> => {
  // Extract table name
  const tableMatch = query.toLowerCase().match(/from\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error('No table specified in query');
  }

  const tableName = tableMatch[1];
  const data = await loadCSV(tableName);

  // Handle SELECT clause
  let selectedColumns = data.headers;
  const selectMatch = query.toLowerCase().match(/select\s+(.+?)\s+from/i);
  if (selectMatch) {
    const columnsStr = selectMatch[1].trim();
    if (columnsStr !== '*') {
      selectedColumns = columnsStr.split(',').map(col => col.trim());
      // Validate columns exist
      selectedColumns.forEach(col => {
        if (!data.headers.includes(col)) {
          throw new Error(`Column ${col} not found`);
        }
      });
    }
  }

  // Handle WHERE clause
  let filteredRows = data.rows;
  const whereMatch = query.toLowerCase().match(/where\s+(.+?)(?:\s+limit\s+\d+)?$/i);
  if (whereMatch) {
    const conditions = whereMatch[1].split(/\s+and\s+/i);
    filteredRows = data.rows.filter(row => {
      return conditions.every(condition => {
        const [column, operator, value] = condition.split(/\s+/);
        const columnIndex = data.headers.indexOf(column);

        if (columnIndex === -1) {
          throw new Error(`Column ${column} not found`);
        }

        const cellValue = row[columnIndex];
        switch (operator.toLowerCase()) {
          case '=':
            return cellValue === value;
          case '>':
            return parseFloat(cellValue) > parseFloat(value);
          case '<':
            return parseFloat(cellValue) < parseFloat(value);
          case '>=':
            return parseFloat(cellValue) >= parseFloat(value);
          case '<=':
            return parseFloat(cellValue) <= parseFloat(value);
          case '!=':
            return cellValue !== value;
          case 'like':
            const pattern = value.replace(/%/g, '.*').replace(/_/g, '.');
            return new RegExp(`^${pattern}$`, 'i').test(cellValue);
          case 'in':
            const values = value.replace(/[()]/g, '').split(',').map(v => v.trim());
            return values.includes(cellValue);
          default:
            return true;
        }
      });
    });
  }

  // Handle LIMIT clause
  const limitMatch = query.toLowerCase().match(/limit\s+(\d+)/i);
  if (limitMatch) {
    const limit = parseInt(limitMatch[1]);
    filteredRows = filteredRows.slice(0, limit);
  }

  // Map selected columns
  const columnIndices = selectedColumns.map(col => data.headers.indexOf(col));
  const mappedRows = filteredRows.map(row => 
    columnIndices.map(index => row[index])
  );

  return {
    headers: selectedColumns,
    rows: mappedRows
  };
}; 