import { useState } from "react";
import axios from "../../../api/axios";

const useStaffHook = () => {
  const [staffs, setStaffs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState(null);

  // helper lives in hook now
  const loadProfileImage = async (staff) => {
    try {
      const response = await axios.get(
        "staff/image_profile/" + staff.staff_id,
        {
          responseType: "blob",
        },
      );
      const blobUrl = URL.createObjectURL(response.data);
      return { ...staff, preview_profile: blobUrl };
    } catch {
      return { ...staff, preview_profile: null };
    }
  };

  const fetchStaffs = async (
    page = 1,
    { department = [], position = [], staff_name = "" } = {}
  ) => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));

      const departmentArray = Array.isArray(department)
        ? department
        : department ? [department] : [];
      const positionArray = Array.isArray(position)
        ? position
        : position ? [position] : [];

      departmentArray.forEach((item) => {
        if (item) params.append("department[]", String(item));
      });
      positionArray.forEach((item) => {
        if (item) params.append("position[]", String(item));
      });

      // add staff_name
      if (staff_name) params.set("staff_name", staff_name);

      const response = await axios.get(`/staff?${params.toString()}`);
      const paginator = response.data.data ?? null;
      const staffList = paginator?.data ?? [];
      setPagination(paginator);
      setStaffs(staffList);
      setStaffLoading(false);

      staffList.forEach(async (staff) => {
        const updatedStaff = await loadProfileImage(staff);
        setStaffs((prevStaffs) =>
          prevStaffs.map((s) =>
            s.staff_id === staff.staff_id ? updatedStaff : s,
          ),
        );
      });
    } catch (error) {
      setStaffError(error);
      setStaffLoading(false);
    }
  };

  const addStaff = async (staffData) => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const formData = new FormData();
      formData.append("first_name", staffData.first_name);
      formData.append("last_name", staffData.last_name);
      formData.append("email", staffData.email);
      formData.append("phone_number", staffData.phone_number);
      formData.append("staff_id", staffData.staff_id);
      formData.append("label_id", staffData.label_id);
      formData.append("isCreatedUser", staffData.isCreatedUser ? "1" : "0");
      formData.append("gender", staffData.gender);
      formData.append("department_name", staffData.department_name);
      formData.append("position_name", staffData.position_name);
      formData.append("date_of_joining", staffData.date_of_joining);
      formData.append("date_of_birth", staffData.date_of_birth);
      if (staffData.isCreatedUser) {
        formData.append("role_name", staffData.role_name || "");
        formData.append("password", staffData.password || "");
      }
      if (staffData.profile_picture instanceof File) {
        formData.append("profile_picture", staffData.profile_picture);
      }
      const response = await axios.post("/staff", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      setStaffError(error);
      throw error;
    } finally {
      setStaffLoading(false);
    }
  };

  const deleteStaff = async (staffId) => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const response = await axios.delete(`/staff/${staffId}`);
      return response;
    } catch (error) {
      setStaffError(error);
      throw error;
    } finally {
      setStaffLoading(false);
    }
  };

  const updateStaff = async (id, staffData) => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const formData = new FormData();
      // Laravel often requires _method: 'PUT' when using FormData via POST
      formData.append("_method", "patch");
      formData.append("first_name", staffData.first_name);
      formData.append("last_name", staffData.last_name);
      formData.append("email", staffData.email);
      formData.append("phone_number", staffData.phone_number);
      formData.append("staff_id", staffData.staff_id);
      formData.append("label_id", staffData.label_id);
      formData.append("isCreatedUser", staffData.isCreatedUser ? "1" : "0");
      formData.append("gender", staffData.gender);
      formData.append("department_name", staffData.department_name);
      formData.append("position_name", staffData.position_name);
      formData.append("date_of_joining", staffData.date_of_joining);
      formData.append("date_of_birth", staffData.date_of_birth);
      formData.append("status", staffData.status);

      if (staffData.isCreatedUser) {
        formData.append("role_name", staffData.role_name || "");
        if (staffData.password) {
          formData.append("password", staffData.password);
        }
      }

      if (staffData.profile_picture instanceof File) {
        formData.append("profile_picture", staffData.profile_picture);
      }

      const response = await axios.post(`/staff/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      setStaffError(error);
      throw error;
    } finally {
      setStaffLoading(false);
    }
  };

  return {
    staffs,
    pagination,
    staffLoading,
    staffError,
    fetchStaffs,
    addStaff,
    deleteStaff,
    updateStaff,
  };
};

export default useStaffHook;
