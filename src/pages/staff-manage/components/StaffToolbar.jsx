import { useEffect, useMemo, useState } from "react";
import SelectCustome from "../../../components/SelectDynamic";
import { AddStaffDialog } from "./AddStaffDialog";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
  onSearchChange,
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
      <div className="flex justify-between">
        {/* Search Staff Name and ID */}
        <div className="flex gap-2">


          <Field className="w-fit min-w-56">
            <Input
              onChange={(e) => onSearchChange(e.target.value)}
              id="input-field-username"
              type="text"
              placeholder="Search Staff Name,ID"
            />
          </Field>
          {/* Select Department  */}
          <SelectCustome
            selectData={selectData}
            placeholder={"Select Department"}
            multiple={true}
            loading={loading}
            value={selectedDepartments}
            onChange={setSelectedDepartments}
          />
          {/* Select Position  */}
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
        {/* Add Staff  */}
        <AddStaffDialog
          fetchStaffs={fetchStaffs}
          addStaff={addStaff}
          staffLoading={staffLoading}
        />
      </div>
    </>
  );
}