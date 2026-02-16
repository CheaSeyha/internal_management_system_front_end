import React from "react";

function ShiftCalendar({ shift_data = [] }) {
  const getColor = (value) => {
    switch (value) {
      case 7:
        return "bg-blue-500 text-white"; // Normal shift
      case 3:
        return "bg-yellow-100 text-black"; // Half shift
      case 23:
        return "bg-gray-500 text-white"; // Off shift
      default:
        return "bg-neutral-300 text-black"; // Unknown
    }
  };

  return (
    <>
      {shift_data.map((value, index) => (
        <div
          key={index}
          className={`rounded-md w-[50px] text-xs font-medium py-2 ${getColor(
            value
          )} transition-colors`}
          title={`Day ${index + 1} → ${value}`}
        >
          {index + 1}
        </div>
      ))}
    </>
  );
}

export default ShiftCalendar;
