import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DynamicTable = ({
  data,
  pageSize = 5,
  detailsUrl = "",
  includeColumns = null,
  excludeColumns = [],
  showStatusIndicator = false,
  statusField = "",
  statusData = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return <p className="text-gray-400">No data available.</p>;
  }

  let columns = Object.keys(data[0]);

  if (includeColumns && includeColumns.length > 0) {
    columns = columns.filter((col) => includeColumns.includes(col));
  } else if (excludeColumns && excludeColumns.length > 0) {
    columns = columns.filter((col) => !excludeColumns.includes(col));
  }

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const renderValue = (value) => {
    if (typeof value !== "string") return String(value);
    const lowerVal = value.toLowerCase();

    if (lowerVal.match(/\.(jpeg|jpg|png|gif|svg|webp)$/)) {
      return <img src={value} alt="preview" className="w-16 h-16 object-cover rounded" />;
    } else if (lowerVal.match(/\.(mp4|webm|ogg)$/)) {
      return <video src={value} controls className="w-32 h-20 rounded" />;
    } else if (lowerVal.startsWith("http")) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
          {value}
        </a>
      );
    } else {
      return value;
    }
  };

  const getStatusForRow = (row) => {
    const rowId = row.ophid || row.OPH_ID;
    if (!rowId || !statusData || statusData.length === 0) return "";

    const matched = statusData.find(
      (statusRow) => statusRow.ophid === rowId || statusRow.OPH_ID === rowId
    );

    return matched ? matched[statusField] : "";
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
      <table className="min-w-full bg-[#1f1f1f] text-white">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 border-b border-gray-600 bg-[#2c2c2c] text-left font-semibold"
              >
                {col}
              </th>
            ))}
            {showStatusIndicator && statusField && (
              <th className="px-4 py-3 border-b border-gray-600 bg-[#2c2c2c] text-left font-semibold">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-[#333333] transition cursor-pointer"
              onClick={() => {
                if (detailsUrl) {
                  const idValue = row.ophid || row.OPH_ID;
                  if (idValue) {
                    navigate(`${detailsUrl}/${idValue}`);
                  }
                }
              }}
            >
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 border-b border-gray-700">
                  {renderValue(row[col])}
                </td>
              ))}
              {showStatusIndicator && statusField && (
                <td className="px-4 py-3 border-b border-gray-700">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      getStatusForRow(row)?.toLowerCase() === "approved"
                        ? "bg-green-500"
                        : getStatusForRow(row)?.toLowerCase() === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 py-4 bg-[#1f1f1f] border-t border-gray-700">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;


//Test Data

// const mainData = [
//   { ophid: 1, name: "Alice", email: "alice@example.com" },
//   { OPH_ID: 2, name: "Bob", email: "bob@example.com" },
//   { ophid: 3, name: "Charlie", email: "charlie@example.com" },
// ];

// const statusData = [
//   { ophid: 1, status: "approved" },
//   { OPH_ID: 2, status: "rejected" },
//   { ophid: 3, status: "approved" },
// ];

// <DynamicTable
//   data={mainData}
//   statusData={statusData}
//   showStatusIndicator={true}
//   statusField="status"
//   pageSize={3}
//   detailsUrl="/user-details"
// />


