import React, { useEffect } from "react";
import roster_data from "../../../data/roster_data.json";
function RosterTable() {
  useEffect(() => {
    console.log(roster_data);
  }, []);

  return (
    <>
      <div className="overflow-x-auto mt-5">
        <table className="table  bg-[#00BDBD] rounded-none text-center">
          {/* head */}
          <thead>
            <tr className="border text-white">
              <th className="border w-fit">NO</th>
              <th className="border">ID</th>
              <th className="border sticky top-0 left-0 bg-[#00BDBD] outline xl:outline-none">
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
                  {index} <br />
                  {data.day_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white ">
            {/* row 1 */}
            {roster_data.staff_data.map((data, index) => (
              <tr key={data.id} className="border border-white bg-[#1D8F8F]">
                <th className="border border-white">{index + 1}</th>
                <td className="border border-white">{data.id}</td>
                <td className="border sticky top-0 left-0 bg-[#1D8F8F] outline xl:outline-none">
                  {data.staff_name}
                </td>
                <td className="border border-white">{data.department}</td>
                <td className="border border-white">{data.position}</td>
                <td className="border border-white">{data.sex}</td>
                {data.shift.map((shift_data, index) => (
                  <td className="border border-white">{shift_data}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RosterTable;
