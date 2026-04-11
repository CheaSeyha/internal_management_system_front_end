import { AddStaffDialog } from "./AddStaffDialog";

export default function StaffToolbar({ fetchStaffs, addStaff, staffLoading }) {
  return (
    <>
      <AddStaffDialog
        fetchStaffs={fetchStaffs}
        addStaff={addStaff}
        staffLoading={staffLoading}
      />
    </>
  );
}
