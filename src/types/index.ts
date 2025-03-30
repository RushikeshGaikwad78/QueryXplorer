export interface Column {
    column: string;
    type: string;
  }
  
  export interface Table {
    [key: string]: Column[];
  }
  
  export interface Database {
    [key: string]: Table;
  }
  
  export interface QueryResult {
    headers: string[];
    rows: any[][];
  }
  
  export interface QueryHistoryItem {
    id: string;
    query: string;
    timestamp: string;
  }
  
  export interface Query {
    id: string;
    name: string;
    sql: string;
    description: string;
    table?: string;
  }
  
  
  export interface QueryState {
    query: string;
    tableData: TableData;
    activeTable: string | null;
    expandedDB: { [key: string]: boolean };
    expandedTables: { [key: string]: boolean };
    databases: Database;
    theme: 'light' | 'dark';
    queryHistory: QueryHistoryItem[];
  }
  
  export interface TableData {
    headers: string[];
    rows: string[][];
  } 