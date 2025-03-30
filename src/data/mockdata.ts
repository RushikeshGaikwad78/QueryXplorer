import { Database } from '../types';

export const mockDatabases: Database = {
  "Database 1": {
    "Users": [
      { column: "ID", type: "INTEGER" },
      { column: "Name", type: "VARCHAR(50)" },
      { column: "Age", type: "INTEGER" }
    ],
    "Orders": [
      { column: "OrderID", type: "INTEGER" },
      { column: "UserID", type: "INTEGER" },
      { column: "Total", type: "DECIMAL(10,2)" }
    ]
  },
  "Database 2": {
    "Products": [
      { column: "ProductID", type: "INTEGER" },
      { column: "ProductName", type: "VARCHAR(100)" },
      { column: "Price", type: "DECIMAL(10,2)" }
    ]
  }
}; 