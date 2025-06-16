import { Link } from "react-router-dom";
import React,{ useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DatePickerModal({ isOpen, onClose, onDateSelect, blockedDates, selectedDate }) {
  if (!isOpen) return null;

  const isBlockedDate = (date) => {
    if (!date) return false;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return false;

    const formattedDate = parsedDate.toISOString().split("T")[0];

    return blockedDates.some(
      (blockedDate) =>
        new Date(blockedDate).toISOString().split("T")[0] === formattedDate
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Select New Date</h2>
        
        <div className="space-y-2">
          <label className="block">
            New Release Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateSelect(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-full p-3 focus:outline-none focus:border-cyan-400"
            required
            min={new Date().toISOString().split("T")[0]}
            onKeyDown={(e) => e.preventDefault()}
            style={{
              backgroundColor: isBlockedDate(selectedDate)
                ? "rgba(255,0,0,0.1)"
                : "transparent",
            }}
          />
          {isBlockedDate(selectedDate) && (
            <span className="text-red-500 text-sm">
              Selected date is blocked. Please choose another date.
              <Link to="/timer-calendar">
                <span className="underline ms-2">
                  Click to See Available Dates
                </span>
              </Link>
            </span>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!isBlockedDate(selectedDate)) {
                onClose();
              }
            }}
            disabled={isBlockedDate(selectedDate)}
            className="px-4 py-2 rounded-full bg-cyan-400 text-gray-900 hover:bg-cyan-300 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
} 