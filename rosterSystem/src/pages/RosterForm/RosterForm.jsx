import React, { useState, useEffect, useRef } from "react";

import ControlButton from "./Components/ControlButton";
import RosterTable from "./Components/RosterTable";

function RosterForm() {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("default", { month: "long" });


  return (
    <>
      <div className="w-full h-full ">
        {/* <h1 className="font-bold text-2xl sticky">IT ROSTER FOR {monthName}</h1> */}
        {/* Custom cursor element */}
        {/* Button Control */}
        {/* <ControlButton/> */}
        <p className="text-center">Avaible in the next update</p>
        {/* <RosterTable/> */}
      </div>
    </>
  );
}

export default RosterForm;