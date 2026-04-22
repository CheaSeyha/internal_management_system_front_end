import { useEffect, useMemo, useState } from "react";
import SelectCustome from "../../../components/SelectDynamic";
import { AddStaffDialog } from "./AddStaffDialog";

export default function StaffToolbar({ fetchStaffs, addStaff, staffLoading, fetchDepartments, departments, loading }) {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);

  const selectData = useMemo(
    () =>
      (departments || []).map((department) => ({
        value: String(department.department_id),
        data: department.department,
      })),
    [departments],
  );

  const positionData = useMemo(() => {
    if (!selectedDepartments.length) return [];

    const selectedDepartmentSet = new Set(selectedDepartments.map((id) => String(id)));
    const uniquePositions = new Set();

    (departments || []).forEach((department) => {
      if (!selectedDepartmentSet.has(String(department.department_id))) return;

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
    fetchDepartments();
  }, []);


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
