import { useEffect, useMemo } from "react";
import SelectCustome from "../../../components/SelectDynamic";
import { AddStaffDialog } from "./AddStaffDialog";

export default function StaffToolbar({
  fetchStaffs,
  addStaff,
  staffLoading,
  fetchDepartments,
  departments,
  loading,
  selectedDepartments,
  setSelectedDepartments,
  selectedPositions,
  setSelectedPositions,
}) {
  const selectData = useMemo(
    () =>
      (departments || []).map((department) => ({
        value: String(department.department),
        data: department.department,
      })),
    [departments],
  );

  const positionData = useMemo(() => {
    if (!selectedDepartments.length) return [];

    const selectedDepartmentSet = new Set(
      selectedDepartments.map((departmentName) => String(departmentName)),
    );
    const uniquePositions = new Map(); // use Map to avoid duplicate position names

    (departments || []).forEach((department) => {
      if (!selectedDepartmentSet.has(String(department.department))) return;

      (department.positions || []).forEach((position) => {
        // position is now an object { position_name, staff_count }
        if (position?.position_name && !uniquePositions.has(position.position_name)) {
          uniquePositions.set(position.position_name, position);
        }
      });
    });

    return Array.from(uniquePositions.values()).map((position) => ({
      value: position.position_name,
      data: position.position_name,
      count: position.staff_count, // <-- map staff_count to count
    }));
  }, [departments, selectedDepartments]);

  return (
    <>
      <div className="flex gap-2">
        <AddStaffDialog
          fetchStaffs={fetchStaffs}
          addStaff={addStaff}
          staffLoading={staffLoading}
        />
        <SelectCustome
          selectData={selectData}
          placeholder={"Select Department"}
          multiple={true}
          loading={loading}
          value={selectedDepartments}
          onChange={setSelectedDepartments}
        />
        {selectedDepartments.length > 0 && (
          <SelectCustome
            selectData={positionData}
            placeholder={"Select Position"}
            multiple={true}
            loading={loading}
            value={selectedPositions}
            onChange={setSelectedPositions}
            isHasCount={true} // <-- add this
          />
        )}
      </div>
    </>
  );
}