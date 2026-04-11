import StaffTable from "./components/StaffTable";
import StaffToolbar from "./components/StaffToolbar";
import useStaffHook from "./hooks/useStaffHook";
import { useEffect } from "react";

function StaffManage() {
  const { staffs, fetchStaffs, staffLoading, addStaff, staffError } =
    useStaffHook();

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    console.log("staffs", staffs);
  }, [staffs]);
  return (
    <>
      <StaffToolbar
        fetchStaffs={fetchStaffs}
        addStaff={addStaff}
        staffLoading={staffLoading}
      />
      <StaffTable
        staffs={staffs}
        fetchStaffs={fetchStaffs}
        staffLoading={staffLoading}
      />
    </>
  );
}

export default StaffManage;
