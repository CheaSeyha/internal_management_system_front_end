import DataTable from "@/components/DataTable";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";

// helper: download image as blob URL
const loadProfileImage = async (staff) => {
  try {
    const response = await axios.get("staff/image_profile/" + staff.staff_id, {
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    return { ...staff, preview_profile: blobUrl };
  } catch {
    return { ...staff, preview_profile: null };
  }
};

export default function StaffTable({ staffs, fetchStaffs, staffLoading }) {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    if (!staffs?.data) return;

    // load all images in parallel
    const loadImages = async () => {
      const results = await Promise.all(
        staffs.data.map((staff) => loadProfileImage(staff)),
      );
      setStaffData(results);
    };

    loadImages();
  }, [staffs]);

  return (
    <DataTable
      data={staffData}
      loading={staffLoading}
      columns={[
        {
          key: "preview_profile",
          label: "Avatar",
          render: (value, row) => (
            <img
              src={value || "/placeholder.png"}
              alt={`${row.first_name} ${row.last_name}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ),
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
