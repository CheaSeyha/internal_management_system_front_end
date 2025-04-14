import React from "react";
import { FileUp } from "lucide-react";
import MonthYearSelector from "../../components/MonthYearSelector";
function RosterForm() {
  // Get current date
  const currentDate = new Date();

  // Get month name (e.g., "January", "February")
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Get month number (e.g., 1 for January)
  const monthNumber = currentDate.getMonth() + 1; // Months are 0-indexed

  return (
    <>
      <div className="w-full h-full px-5 md:px-[80px] mt-5">
        <h1 className="font-bold text-2xl">IT ROSTER FOR {monthName}</h1>
        {/* Button Controll */}
        <div className="button-control flex gap-2 items-end text-white w-full">
          {/* Show Department  */}
          <fieldset className="fieldset border-none w-fit show-department">
            <legend className="fieldset-legend">Departments</legend>
            <select
              defaultValue="Show Departmens "
              className="select bg-[#2F82FF]"
            >
              <option>Show All</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finace</option>
              <option>F&B</option>
            </select>
          </fieldset>
          {/* Edit Roster  */}
          <fieldset className="fieldset w-fit edit-roster">
            <legend className="fieldset-legend">Edit Roster</legend>
            <select
              defaultValue="OFF"
              className="select border-none bg-[#099740]"
            >
              <option>OFF</option>
              <option>7</option>
              <option>11</option>
              <option>3</option>
              <option>9</option>
            </select>
          </fieldset>
          {/* Upload Roster  */}
          <button className="btn mb-1 bg-[#06DBDB] text-white">
            <span>
              <FileUp size={20} />
            </span>{" "}
            Upload Roster
          </button>
          {/* Select Data And Year Show Roster  */}
          <MonthYearSelector />
        </div>
      </div>
    </>
  );
}

export default RosterForm;
