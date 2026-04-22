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
    const uniquePositions = new Set();

    (departments || []).forEach((department) => {
      if (!selectedDepartmentSet.has(String(department.department))) return;

      (department.positions || []).forEach((position) => {
        if (position) uniquePositions.add(position);
      });
    });

    return Array.from(uniquePositions).map((position) => ({
      value: position,
      data: position,
    }));
  }, [departments, selectedDepartments]);


  useEffect(() => {
    console.log(departments)
  }, [departments])

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
          />
        )}
      </div>
    </>
  );
}
