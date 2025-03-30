import { Database } from '../types';

export const mockDatabases: Database = {
  "Northwind": {
    "customers": [
      { column: "CustomerID", type: "VARCHAR(5)" },
      { column: "CompanyName", type: "VARCHAR(100)" },
      { column: "ContactName", type: "VARCHAR(100)" },
      { column: "ContactTitle", type: "VARCHAR(100)" },
      { column: "Address", type: "VARCHAR(200)" },
      { column: "City", type: "VARCHAR(100)" },
      { column: "Region", type: "VARCHAR(100)" },
      { column: "PostalCode", type: "VARCHAR(20)" },
      { column: "Country", type: "VARCHAR(100)" },
      { column: "Phone", type: "VARCHAR(20)" },
      { column: "Fax", type: "VARCHAR(20)" }
    ],
    "products": [
      { column: "ProductID", type: "INTEGER" },
      { column: "ProductName", type: "VARCHAR(100)" },
      { column: "SupplierID", type: "INTEGER" },
      { column: "CategoryID", type: "INTEGER" },
      { column: "QuantityPerUnit", type: "VARCHAR(50)" },
      { column: "UnitPrice", type: "DECIMAL(10,2)" },
      { column: "UnitsInStock", type: "INTEGER" },
      { column: "UnitsOnOrder", type: "INTEGER" },
      { column: "ReorderLevel", type: "INTEGER" },
      { column: "Discontinued", type: "BOOLEAN" }
    ],
    "orders": [
      { column: "OrderID", type: "INTEGER" },
      { column: "CustomerID", type: "VARCHAR(5)" },
      { column: "EmployeeID", type: "INTEGER" },
      { column: "OrderDate", type: "DATE" },
      { column: "RequiredDate", type: "DATE" },
      { column: "ShippedDate", type: "DATE" },
      { column: "ShipVia", type: "INTEGER" },
      { column: "Freight", type: "DECIMAL(10,2)" },
      { column: "ShipName", type: "VARCHAR(100)" },
      { column: "ShipAddress", type: "VARCHAR(200)" },
      { column: "ShipCity", type: "VARCHAR(100)" },
      { column: "ShipRegion", type: "VARCHAR(100)" },
      { column: "ShipPostalCode", type: "VARCHAR(20)" },
      { column: "ShipCountry", type: "VARCHAR(100)" }
    ],
    "order_details": [
      { column: "OrderID", type: "INTEGER" },
      { column: "ProductID", type: "INTEGER" },
      { column: "UnitPrice", type: "DECIMAL(10,2)" },
      { column: "Quantity", type: "INTEGER" },
      { column: "Discount", type: "DECIMAL(3,2)" }
    ],
    "employees": [
      { column: "EmployeeID", type: "INTEGER" },
      { column: "LastName", type: "VARCHAR(50)" },
      { column: "FirstName", type: "VARCHAR(50)" },
      { column: "Title", type: "VARCHAR(100)" },
      { column: "TitleOfCourtesy", type: "VARCHAR(50)" },
      { column: "BirthDate", type: "DATE" },
      { column: "HireDate", type: "DATE" },
      { column: "Address", type: "VARCHAR(200)" },
      { column: "City", type: "VARCHAR(100)" },
      { column: "Region", type: "VARCHAR(100)" },
      { column: "PostalCode", type: "VARCHAR(20)" },
      { column: "Country", type: "VARCHAR(100)" },
      { column: "HomePhone", type: "VARCHAR(20)" },
      { column: "Extension", type: "VARCHAR(10)" },
      { column: "Photo", type: "BLOB" },
      { column: "Notes", type: "TEXT" },
      { column: "ReportsTo", type: "INTEGER" },
      { column: "PhotoPath", type: "VARCHAR(200)" }
    ],
    "suppliers": [
      { column: "SupplierID", type: "INTEGER" },
      { column: "CompanyName", type: "VARCHAR(100)" },
      { column: "ContactName", type: "VARCHAR(100)" },
      { column: "ContactTitle", type: "VARCHAR(100)" },
      { column: "Address", type: "VARCHAR(200)" },
      { column: "City", type: "VARCHAR(100)" },
      { column: "Region", type: "VARCHAR(100)" },
      { column: "PostalCode", type: "VARCHAR(20)" },
      { column: "Country", type: "VARCHAR(100)" },
      { column: "Phone", type: "VARCHAR(20)" },
      { column: "Fax", type: "VARCHAR(20)" },
      { column: "HomePage", type: "TEXT" }
    ],
    "categories": [
      { column: "CategoryID", type: "INTEGER" },
      { column: "CategoryName", type: "VARCHAR(100)" },
      { column: "Description", type: "TEXT" },
      { column: "Picture", type: "BLOB" }
    ],
    "shippers": [
      { column: "ShipperID", type: "INTEGER" },
      { column: "CompanyName", type: "VARCHAR(100)" },
      { column: "Phone", type: "VARCHAR(20)" }
    ],
    "territories": [
      { column: "TerritoryID", type: "VARCHAR(20)" },
      { column: "TerritoryDescription", type: "VARCHAR(100)" },
      { column: "RegionID", type: "INTEGER" }
    ],
    "regions": [
      { column: "RegionID", type: "INTEGER" },
      { column: "RegionDescription", type: "VARCHAR(100)" }
    ],
    "employee_territories": [
      { column: "EmployeeID", type: "INTEGER" },
      { column: "TerritoryID", type: "VARCHAR(20)" }
    ]
  },
  "Healthcare": {
    "hospitals": [
      { column: "HospitalID", type: "INTEGER" },
      { column: "Name", type: "VARCHAR(100)" },
      { column: "Location", type: "VARCHAR(100)" }
    ],
    "patients": [
      { column: "PatientID", type: "INTEGER" },
      { column: "Name", type: "VARCHAR(100)" },
      { column: "DOB", type: "DATE" }
    ],
    "doctors": [
      { column: "DoctorID", type: "INTEGER" },
      { column: "Name", type: "VARCHAR(100)" },
      { column: "Specialization", type: "VARCHAR(100)" }
    ]
  },
  
  "ECommerce": {
    "products": [
      { column: "ProductID", type: "INTEGER" },
      { column: "ProductName", type: "VARCHAR(100)" },
      { column: "Price", type: "DECIMAL(10,2)" }
    ],
    "customers": [
      { column: "CustomerID", type: "INTEGER" },
      { column: "Name", type: "VARCHAR(100)" },
      { column: "Email", type: "VARCHAR(100)" }
    ],
    "orders": [
      { column: "OrderID", type: "INTEGER" },
      { column: "CustomerID", type: "INTEGER" },
      { column: "OrderDate", type: "DATE" }
    ]
  }
  
}; 