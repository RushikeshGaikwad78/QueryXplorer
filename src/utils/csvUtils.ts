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
    // console.error(`Error loading CSV for ${tableName}:`, error);
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
const VALID_TABLES = new Set(['categories', 'customers', 'employees', 'orders', 'products', 'suppliers', 'shippers', 'order_details']); 

export const executeQuery = async (query: string): Promise<TableData> => {
  // Extract table name
  const tableMatch = query.toLowerCase().match(/from\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error('No table specified in query');
  }

  const tableName = tableMatch[1];

  // Check if table name is valid
  if (!VALID_TABLES.has(tableName)) {
    throw new Error(`Invalid table name: "${tableName}"`);
  }

  const data = await loadCSV(tableName);

  // Handle SELECT clause
  let selectedColumns = data.headers;
  
  // Map selected columns
  const columnIndices = selectedColumns.map(col => data.headers.indexOf(col));
  const mappedRows = data.rows.map(row => 
    columnIndices.map(index => row[index])
  );

  return {
    headers: selectedColumns,
    rows: mappedRows
  };
};
