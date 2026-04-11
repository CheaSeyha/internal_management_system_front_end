import StaffTable from "./components/StaffTable";
import StaffToolbar from "./components/StaffToolbar";
import useStaffHook from "./hooks/useStaffHook";
import { useEffect } from "react";

function StaffManage() {
  const { staffs, fetchStaffs, staffLoading } = useStaffHook();

  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <>
      <StaffToolbar fetchStaffs={fetchStaffs} />
      <StaffTable
        staffs={staffs}
        fetchStaffs={fetchStaffs}
        staffLoading={staffLoading}
      />
    </>
  );
}

export default StaffManage;
