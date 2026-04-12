import DataTable from "@/components/DataTable";
import {
  Pencil,
  Trash,
  Briefcase,
  BadgeCheck,
  XCircle,
  Clock,
  Shield,
} from "lucide-react";
import { useEffect } from "react";

export default function StaffTable({
  staffs,
  staffLoading,
  deleteStaff,
  updateStaff,
}) {
  const data = Array.isArray(staffs) ? staffs : [];

  //  Theme-aware badge system (ShadCN style)
  const badge = (type, value) => {
    const config = {
      role: {
        icon: <Shield className="w-3.5 h-3.5" />,
        class: (value) => {
          const styles = {
            super_admin:
              "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20",

            admin:
              "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",

            user: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-500/20",
          };

          return styles[value] || styles.user;
        },
      },

      active: {
        icon: <BadgeCheck className="w-3.5 h-3.5" />,
        class:
          "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
      },

      inactive: {
        icon: <XCircle className="w-3.5 h-3.5" />,
        class:
          "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20",
      },

      suspended: {
        icon: <XCircle className="w-3.5 h-3.5" />,
        class:
          "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
      },

      resigned: {
        icon: <Clock className="w-3.5 h-3.5" />,
        class:
          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
      },

      terminated: {
        icon: <XCircle className="w-3.5 h-3.5" />,
        class:
          "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
      },
    };

    const cfg = config[type] || {
      icon: <Shield className="w-3.5 h-3.5" />,
      class:
        "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium capitalize ${cfg.class}`}
      >
        {cfg.icon}
        {value || "Unknown"}
      </span>
    );
  };

  return (
    <DataTable
      showCheckbox={false}
      data={data}
      loading={staffLoading}
      className="bg-background text-foreground"
      columns={[
        // Profile
        {
          key: "profile_picture",
          label: "Profile",
          render: (_, row) => {
            if (row.preview_profile === undefined) {
              return (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              );
            }

            return (
              <img
                src={row.preview_profile || "/placeholder.png"}
                alt={`${row.first_name} ${row.last_name}`}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
            );
          },
        },

        { key: "staff_id", label: "Staff ID" },

        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },

        //  Gender
        {
          key: "genders",
          label: "Gender",
          render: (value) => (
            <span className="text-muted-foreground capitalize">
              {value || "Not set"}
            </span>
          ),
        },

        // Phone
        {
          key: "phone_number",
          label: "Phone",
          render: (value) => (
            <span className="text-muted-foreground">{value || "—"}</span>
          ),
        },

        // Department
        {
          key: "department_name",
          label: "Department",
          render: (value) => (
            <span className="text-foreground/80">{value || "—"}</span>
          ),
        },

        // Position
        {
          key: "position_name",
          label: "Position",
          render: (value) => (
            <span className="text-foreground/80">{value || "—"}</span>
          ),
        },
        // Role
        {
          key: "role_name",
          label: "Role",
          render: (value) => badge("role", value),
        },

        // Account Status
        {
          key: "account_status",
          label: "Account Status",
          render: (value) => badge(value, value),
        },
        // Employment Status
        {
          key: "status",
          label: "Employment Status",
          render: (value) => badge(value, value),
        },
      ]}
      actions={[
        {
          label: "Edit",
          icon: <Pencil className="w-4 h-4" />,
          onClick: (row) => updateStaff(row),
        },
        {
          label: "Delete",
          icon: <Trash className="w-4 h-4" />,
          onClick: (row) => deleteStaff(row),
          className: "text-red-500",
          separator: true,
        },
      ]}
    />
  );
}
