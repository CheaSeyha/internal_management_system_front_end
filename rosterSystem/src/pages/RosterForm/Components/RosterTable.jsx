import React, { useEffect } from "react";
import roster_data from "../../../data/roster_data.json";

function RosterTable() {
  function getCurrentMonthDays() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDay = date.getDate(); // Get current day of the month

    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = [];

    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const dayIndex = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
      days.push({
        day_name: dayNames[dayIndex],
        day_number: day,
        is_current: day === currentDay, // Add flag for current day
      });
    }

    return { days, currentDay };
  }

  // Example usage:
  const currentMonthDays = getCurrentMonthDays();

  const getShiftColor = (shift) => {
    switch (shift) {
      case 7:
        return "bg-[#0100FC]"; // Blue
      case 9:
        return "bg-[#D56FCB]"; // Pink
      case 11:
        return "bg-[#FDE2D0] text-gray-900 border border-black"; // White with dark text
      case 15:
        return "bg-[#04FEC7]"; // Light gray
      case 22:
        return "bg-[#282929]"; // Dark gray
      case "OFF":
        return "bg-red-600"; // Red
      case "UPL":
        return "bg-[#292929]"; // Very dark gray
      default:
        return "bg-gray-200"; // Default light gray
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5">
        <table className="table-auto w-auto bg-[#FEFF02] rounded-none text-center">
          {/* head */}
          <thead>
            <tr className="border border-white text-[#353535] whitespace-nowrap">
              <th className="border px-2">NO</th>{" "}
              {/* px-2 for minimal padding */}
              <th className="border px-2">ID</th>
              <th className="border px-2 outline outline-black sticky left-0 bg-[#FEFF02] z-10">
                Name
              </th>
              <th className="border px-2">Department</th>
              <th className="border px-2">Position</th>
              <th className="border px-2">Sex</th>
              {currentMonthDays.days.map((data, index) => (
                <th
                  key={index}
                  className={`border${
                    data.day_name === "Sun" ? "bg-red-600" : ""
                  } ${data.is_current ? "bg-gray-600 text-white" : ""}`}
                >
                  <div className="flex flex-col w-full">
                    <span className="border-b w-full  px-2">{data.day_name}</span>
                    <span>{index + 1}</span>
                  </div>
                </th>
              ))}
              <th className="border px-2 bg-red-600">OFF</th>
              <th className="border px-2">Balance</th>
              <th className="border px-2 bg-[#919191]">UPL</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {roster_data.staff_data.map((data, index) => (
              <tr
                key={data.id}
                className="border border-black bg-white text-black whitespace-nowrap h-[40px]"
              >
                <td className="border border-black px-2">{index + 1}</td>
                <td className="border border-black px-2">{data.id}</td>
                <td className="border border-black outline outline-black px-2 sticky left-0 bg-white z-10">
                  {data.staff_name}
                </td>
                <td className="border border-black px-2">{data.department}</td>
                <td className="border border-black px-2">{data.position}</td>
                <td className="border border-black px-2">{data.sex}</td>
                {data.shift.map((shift, j) => (
                  <td
                    key={j}
                    className={`border border-black px-1 text-white ${getShiftColor(
                      shift
                    )}`}
                  >
                    {shift}
                  </td>
                ))}
                <td className="border border-black px-2">{data.off}</td>
                <td className="border border-black px-2">{data.balace}</td>
                <td className="border border-black px-2">{data.upl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RosterTable;
