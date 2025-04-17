import React, { useEffect } from "react";
import roster_data from "../../../data/roster_data.json";
function RosterTable() {
  useEffect(() => {
    console.log(roster_data);
  }, []);

  const getShiftColor = (shift) => {
    switch (shift) {
      case 7: return "bg-[#3333cc]";       // Blue
      case 9: return "bg-[#cc0099]";       // Pink
      case 11: return "bg-white text-gray-900"; // White with dark text
      case 15: return "bg-gray-400";       // Light gray
      case 22: return "bg-gray-700";       // Dark gray
      case "OFF": return "bg-red-600";     // Red
      case "UPL": return "bg-[#292929]";   // Very dark gray
      default: return "bg-gray-200";       // Default light gray
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5">
        <table className="table bg-[#00BDBD] rounded-none text-center">
          {/* head */}
          <thead className="">
            <tr className="border text-white">
              <th className="border w-fit">NO</th>
              <th className="border">ID</th>
              <th className="border sticky md:relative top-0 left-0 bg-[#00BDBD] outline xl:outline-none">
                Name
              </th>
              <th className="border">Department</th>
              <th className="border">Position</th>
              <th className="border">Sex</th>
              {roster_data.days.map((data, index) => (
                <th
                  key={index}
                  className={`border ${
                    data.day_name == "Sun" ? "bg-red-600" : ""
                  }`}
                >
                  {index + 1} <br />
                  {data.day_name}
                </th>
              ))}
              <th className="border bg-red-600">OFF</th>
              <th className="border ">Balance</th>
              <th className="border bg-[#292929]">UPL</th>
            </tr>
          </thead>
          <tbody className="text-white ">
            {/* row 1 */}
            {roster_data.staff_data.map((data, index) => (
              <tr key={data.id} className="border border-white bg-[#1D8F8F]">
                <th className="border border-white">{index + 1}</th>
                <td className="border border-white">{data.id}</td>
                <td className="border sticky md:relative top-0 left-0 bg-[#1D8F8F] outline xl:outline-none">
                  {data.staff_name}
                </td>
                <td className="border border-white">{data.department}</td>
                <td className="border border-white">{data.position}</td>
                <td className="border border-white">{data.sex}</td>
                {data.shift.map((shift, j) => (
                <td key={j} className={`border border-white ${getShiftColor(shift)}`}>
                  {shift}
                </td>
              ))}
                <td className="border border-white">{data.off}</td>
                <td className="border border-white">{data.balace}</td>
                <td className="border border-white">{data.upl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RosterTable;
