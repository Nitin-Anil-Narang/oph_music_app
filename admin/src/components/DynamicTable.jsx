import React, { useState } from "react";

const DynamicTable = ({ data, pageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const columns = Object.keys(data[0]);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Helper: Check if value is image or video
  const renderValue = (value) => {
    if (typeof value !== "string") return String(value);

    const lowerVal = value.toLowerCase();
    if (lowerVal.match(/\.(jpeg|jpg|png|gif)$/)) {
      return (
        <img
          src={value}
          alt="preview"
          className="w-16 h-16 object-cover rounded"
        />
      );
    } else if (lowerVal.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <video
          src={value}
          controls
          className="w-32 h-20 rounded"
        />
      );
    } else if (lowerVal.startsWith("http")) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {value}
        </a>
      );
    } else {
      return value;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="border px-4 py-2 bg-white-200 text-left font-bold"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col} className="border px-4 py-2">
                  {renderValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
