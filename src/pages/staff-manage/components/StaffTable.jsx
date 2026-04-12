import DataTable from "@/components/DataTable";
import { Pencil, Trash } from "lucide-react";

export default function StaffTable({
  staffs,
  staffLoading,
  deleteStaff,
  updateStaff,
}) {
  // staffs is now the direct array from the hook
  const data = Array.isArray(staffs) ? staffs : [];

  return (
    <DataTable
      data={data}
      loading={staffLoading}
      columns={[
        {
          key: "profile_picture",
          label: "Profile",
          render: (_, row) => {
            if (row.preview_profile === undefined) {
              return (
                <div className="w-8 h-8 rounded-full bg-accent animate-pulse" />
              );
            }
            return (
              <img
                src={row.preview_profile || "/placeholder.png"}
                alt={`${row.first_name} ${row.last_name}`}
                className="w-8 h-8 rounded-full object-cover border"
              />
            );
          },
        },
        { key: "staff_id", label: "Staff ID" },
        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },
        {
          key: "genders",
          label: "Gender",
          render: (value) => (
            <p className="capitalize">{value || "No Gender"}</p>
          ),
        },
        { key: "phone_number", label: "Phone Number" },
        {
          key: "role_name",
          label: "User Role",
          render: (value) => <p className="capitalize">{value || "No User"}</p>,
        },
        { key: "department_name", label: "Department" },
        { key: "position_name", label: "Position" },
        {
          key: "status",
          label: "Status",
          render: (value) => (
            <p
              className={`capitalize ${
                value === "active" ? "text-green-500" : "text-red-500"
              }`}
            >
              {value}
            </p>
          ),
        },
      ]}
      actions={[
        {
          label: "Edit",
          icon: <Pencil className="h-4 w-4" />,
          onClick: (row) => updateStaff(row),
        },
        {
          label: "Delete",
          icon: <Trash className="h-4 w-4" />,
          onClick: (row) => deleteStaff(row),
          className: "text-red-500",
          separator: true,
        },
      ]}
    />
  );
}
