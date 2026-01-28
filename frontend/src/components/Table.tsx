import React from 'react';

// Define a generic type for the data rows
export interface Column<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode; // Optional custom render function for cells
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  uniqueKey?: keyof T; // Optional prop to specify a unique key for rows
  emptyMessage?: string;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  uniqueKey = 'id' as keyof T, // Default to 'id' if not provided
  emptyMessage = 'No data available.',
}: TableProps<T>) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th scope="col" className="py-3 px-6" key={column.key}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={item[uniqueKey]}
            >
              {columns.map((column) => (
                <td className="py-4 px-6" key={`${item[uniqueKey]}-${column.key}`}>
                  {column.render ? column.render(item) : (item[column.key] || 'N/A')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
