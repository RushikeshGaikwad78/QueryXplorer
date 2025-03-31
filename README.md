# 🚀 QueryXplorer

QueryXplorer is a modern, responsive web application for exploring and executing SQL-like queries on CSV data. Built with React and Material-UI, it provides a user-friendly interface for data analysis and query management.

## LINK to the Deployed Application :-  [QueryXplorer](https://query-xplorer.vercel.app/)


## 🎥 Demo Video

Watch the demo video here: [QueryXplorer Demo](https://www.youtube.com/watch?v=xbGpIK62Fv0&ab_channel=RushiGaikwad)

## ✨ Features

- **📝 Query Management**
  - SQL-like query editor with syntax highlighting
  - Predefined query templates for testing queries
  - Query history tracking
  - Copy/paste query support

- **📊 Query Result Display**
  - Interactive data tables
  - Filtering capabilities for columns
  - Pagination support
  - Responsive table layout

- **🗄️ Database Explorer**
  - Hierarchical view of databases and tables
  - Expandable/collapsible sections
  - Column type information
  - Quick access to table structures/schemas

- **⚡ Performance Optimizations**
  - Lazy loading of components
  - Aria labels for interactive elements
  - Structured List rendering
  - Efficient CSV parsing with chunked loading
  - Caching mechanism for query results
  - Optimized table rendering
 
- **🎨 Modern UI/UX**
  - Responsive design that works on both desktop and mobile devices
  - Dark/Light theme support
  - Material Design components
  - Smooth animations and transitions

## 🔧 Technical Implementation

### 📊 Data Handling

- **CSV Processing**
  - Chunked loading with initial 100 rows for immediate display
  - Background processing of remaining rows in 1000-row chunks
  - Efficient memory management with streaming parser
  - Type inference for columns

- **Query Execution**
  - Table name fetching using regerx from query
  - Efficient sorting and filtering algorithms
  - Result caching with cache strategy

- **State Management**
  - React Context for global state
  - Local state with useState for component-specific data
  - Persistent storage for user preferences
  - Optimized state updates to prevent unnecessary renders


### 🔄 Caching Strategy

- **Query Results Cache**
  - cache implementation
  - Cache invalidation on data changes

- **UI State Cache**
  - Table column configurations
  - Query history
  - Theme preferences

### 🎯 UI/UX Optimizations
- **Performance Enhancements**
  - Virtualized table rendering for large datasets
  - Debounced search and filter operations
  - Memoized components using React.memo
  - Optimized re-renders with useCallback and useMemo hooks
    
- **Theme Implementation**
  - Custom theme provider with dark/light mode support
  - CSS-in-JS styling with emotion
  - Consistent color palette with primary/secondary colors
  - Dynamic theme switching without page reload

## 💡 Key Achievements
- **Performance**: Optimized for handling large datasets through chunked loading and virtualization
- **Usability**: Intuitive interface that makes complex data operations accessible
- **Flexibility**: Support for custom queries and predefined templates
- **Scalability**: Modular architecture that can be extended with new features

## 🛠️ Tech Stack

- React
- TypeScript
- Material-UI (MUI)
- CodeMirror for SQL editor
  - Syntax highlighting
  - Auto-completion
  - Error detection
  - Custom SQL mode
- CSV parsing utilities
- Custom query execution engine

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/queryxplorer.git
cd queryxplorer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/         # React components
├── data/             # Mock data and predefined queries
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```
### 🎓 Learning Outcomes
- Modern React patterns and best practices
- Performance optimization techniques
- TypeScript for type safety
- Material-UI component system
- CodeMirror integration
- Efficient data processing strategies
  
## 🎯 Conclusion
QueryXplorer demonstrates how modern web technologies can be leveraged to create powerful data exploration tools. By combining efficient data processing with an intuitive user interface, it provides a seamless experience for working with CSV data through SQL-like queries.
