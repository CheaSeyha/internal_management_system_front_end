import DataTable from "@/components/DataTable";
import { Pencil, Trash } from "lucide-react";

export default function StaffTable({ staffs, staffLoading }) {
  // staffs is now the direct array from the hook
  const data = Array.isArray(staffs) ? staffs : [];

  return (
    <DataTable
      data={data}
      loading={staffLoading}
      columns={[
        {
          key: "profile_picture",
          label: "Avatar",
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
        {
          key: "first_name",
          label: "Full Name",
          render: (_, row) => `${row.first_name} ${row.last_name}`,
        },
        { key: "genders", label: "Gender" },
        { key: "email", label: "Email" },
        { key: "phone_number", label: "Phone Number" },
        {
          key: "department",
          label: "Department",
          render: (value) => value?.department_name ?? "-",
        },
        {
          key: "position",
          label: "Position",
          render: (value) => value?.position_name ?? "-",
        },
        { key: "date_of_joining", label: "Date of Joining" },
        { key: "date_of_birth", label: "Date of Birth" },
      ]}
      actions={[
        {
          label: "Edit",
          icon: <Pencil className="h-4 w-4" />,
          onClick: (row) => console.log("Edit", row),
        },
        {
          label: "Delete",
          icon: <Trash className="h-4 w-4" />,
          onClick: (row) => console.log("Delete", row),
          className: "text-red-500",
          separator: true,
        },
      ]}
    />
  );
}
