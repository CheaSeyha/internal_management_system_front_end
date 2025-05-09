import React, { useEffect } from "react";
import roster_data from "../../../data/roster_data.json";
function RosterTable() {
  function getCurrentMonthDays() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = [];

    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const dayIndex = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
      days.push({ day_name: dayNames[dayIndex] });
    }

    return { days };
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
        <table className="table bg-[#FEFF02] rounded-none text-center">
          {/* head */}
          <thead className="">
            <tr className="border border-white text-[#353535]">
              <th className="border w-fit">NO</th>
              <th className="border">ID</th>
              <th className="border sticky md:relative top-0 left-0 bg-[#FEFF02] outline xl:outline-none">
                Name
              </th>
              <th className="border">Department</th>
              <th className="border">Position</th>
              <th className="border">Sex</th>
              {currentMonthDays.days.map((data, index) => (
                <th
                  key={index}
                  className={`border ${
                    data.day_name == "Sun" ? "bg-red-600" : ""
                  }`}
                >
                  {data.day_name}
                  <br />
                  {index + 1}
                </th>
              ))}
              <th className="border bg-red-600">OFF</th>
              <th className="border ">Balance</th>
              <th className="border bg-[#919191]">UPL</th>
            </tr>
          </thead>
          <tbody className="text-white ">
            {/* row 1 */}
            {roster_data.staff_data.map((data, index) => (
              <tr
                key={data.id}
                className="border border-black bg-[#ffffff] text-black"
              >
                <th className="border border-black">{index + 1}</th>
                <td className="border border-black">{data.id}</td>
                <td className="border sticky md:relative top-0 left-0 bg-[#ffffff] outline outline-black xl:outline-none">
                  {data.staff_name}
                </td>
                <td className="border border-black">{data.department}</td>
                <td className="border border-black">{data.position}</td>
                <td className="border border-black">{data.sex}</td>
                {data.shift.map((shift, j) => (
                  <td
                    key={j}
                    className={`border border-black text-white ${getShiftColor(
                      shift
                    )}`}
                  >
                    {shift}
                  </td>
                ))}
                <td className="border border-black">{data.off}</td>
                <td className="border border-black">{data.balace}</td>
                <td className="border border-black">{data.upl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RosterTable;
