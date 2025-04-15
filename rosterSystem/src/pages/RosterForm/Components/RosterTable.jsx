import React from "react";

function RosterTable() {
  return (
    <>
      <div className="overflow-x-auto mt-5">
        <table className="table  bg-[#00BDBD] rounded-none text-center">
          {/* head */}
          <thead>
            <tr className="border text-white">
              <th className="border w-fit">NO</th>
              <th className="border">ID</th>
              <th className="border sticky top-0 left-0 bg-[#00BDBD] outline xl:outline-none">Name</th>
              <th className="border">Department</th>
              <th className="border">Position</th>
              <th className="border">Sex</th>
            </tr>
          </thead>
          <tbody className="text-white ">
            {/* row 1 */}
            <tr className="border border-white bg-[#1D8F8F]">
              <th className="border border-white">1</th>
              <td className="border border-white">HR16888</td>
              <td className="border sticky top-0 left-0 bg-[#1D8F8F] outline xl:outline-none">Plaok Meas</td>
              <td className="border border-white">IT</td>
              <td className="border border-white">IT Officer</td>
              <td className="border border-white">M</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RosterTable;
