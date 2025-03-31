import { Query } from '../types';
export const predefinedQueries: Query[] = [
    {
        id: 'products',
        name: 'List All Products',
        sql: 'SELECT * FROM products',
        description: 'SELECT * FROM products',
        table: 'products.csv'
      },
      {
        id: 'orders',
        name: 'List All Orders',
        sql: 'SELECT * FROM orders',
        description: 'SELECT * FROM orders',
        table: 'orders.csv'
      },
      {
        id: 'order_details',
        name: 'Order Details',
        sql: 'SELECT * FROM order_details',
        description: 'SELECT * FROM order_details',
        table: 'order_details.csv'
      },
      {
        id: 'suppliers',
        name: 'List Suppliers',
        sql: 'SELECT * FROM suppliers',
        description: 'SELECT * FROM suppliers',
        table: 'suppliers.csv'
      },
      {
        id: 'shippers',
        name: 'List Shippers',
        sql: 'SELECT * FROM shippers',
        description: 'SELECT * FROM shippers',
        table: 'shippers.csv'
      }
  ];