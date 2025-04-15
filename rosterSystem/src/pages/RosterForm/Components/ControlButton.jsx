import React, { useState, useEffect, useRef } from "react";
import { FileUp, Paintbrush } from "lucide-react";
import MonthYearSelector from "../../../components/MonthYearSelector";
function ControlButton() {
  const cursorRef = useRef(null);

  const [showCustomCursor, setShowCustomCursor] = useState(false);

  const handleRosterSelectChange = (e) => {
    setShowCustomCursor(e.target.value !== "Select Type");
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    if (showCustomCursor) {
      // Hide the default cursor for the entire document
      document.documentElement.style.cursor = "none";
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      // Restore default cursor
      document.documentElement.style.cursor = "";
    }

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showCustomCursor]);

  return (
    <>
      {showCustomCursor && (
        <div
          ref={cursorRef}
          className="fixed pointer-events-none z-[9999]"
          style={{
            transform: "translate(-50%, -50%)", // Centers the icon on cursor position
          }}
        >
          <Paintbrush size={20} className="text-text" />
        </div>
      )}
      <div className="button-control flex flex-wrap gap-2 items-end text-white w-full">
        {/* Show Department  */}
        <fieldset className="fieldset border-none w-full sm:w-fit show-department">
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
        <fieldset className="fieldset w-full sm:w-fit edit-roster">
          <legend className="fieldset-legend">Edit Roster</legend>
          <select
            defaultValue="Edit Roster"
            className="select border-none bg-[#099740]"
            onChange={handleRosterSelectChange}
          >
            <option>Select Type</option>
            <option className="bg-red-600">OFF</option>
            <option className="bg-[#25ec36]">UPL</option>
            <option className="bg-primary">7</option>
            <option className="bg-pink-700">9</option>
            <option className="bg-white text-black">11</option>
            <option className="bg-[#009c94]">15</option>
            <option className="bg-[#093836]">22</option>
          </select>
        </fieldset>

        {/* Select Data And Year Show Roster  */}
        <MonthYearSelector />

        {/* Upload Roster  */}
        <button className="btn mb-1 bg-[#06DBDB] text-white w-full sm:w-fit">
          <span>
            <FileUp size={20} />
          </span>{" "}
          Upload Roster
        </button>
      </div>
    </>
  );
}

export default ControlButton;
