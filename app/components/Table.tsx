import React from 'react';

interface TableProps {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-300 text-gray-800">
            {headers.map((header, index) => (
              <th key={index} className="p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b text-gray-900 ${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-2 text-center">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
