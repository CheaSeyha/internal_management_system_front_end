import ShowStaffRoster from "./Components/ShowStaffRoster";
import useRosterHook from "@/hooks/useRosterHook";
import { useEffect } from "react";

function RosterForm() {
  const { roster, rosterLoading, fetchRoster } = useRosterHook();

  useEffect(() => {
    // Fetch the first month of the year
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    fetchRoster(month, year);
  }, []);

  return (
    <div className="w-full h-full ">
      <ShowStaffRoster />
    </div>
  );
}

export default RosterForm;