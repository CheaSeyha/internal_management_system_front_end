import { AddStaffDialog } from "./AddStaffDialog";

export default function StaffToolbar({ fetchStaffs }) {
  return (
    <>
      <AddStaffDialog fetchStaffs={fetchStaffs} />
    </>
  );
}
