import { useState } from "react";
import axios from "../../../api/axios";

const useStaffHook = () => {
  const [staffs, setStaffs] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState(null);

  const fetchStaffs = async () => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const response = await axios.get("/staff");
      setStaffs(response.data);
    } catch (error) {
      setStaffError(error);
    } finally {
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

      // ✅ Only append role & password when user login is enabled
      if (staffData.isCreatedUser) {
        formData.append("role_name", staffData.role_name || "");
        formData.append("password", staffData.password || "");
      }

      // ✅ profile_picture is already a File object — no .file wrapper needed
      if (staffData.profile_picture instanceof File) {
        formData.append("profile_picture", staffData.profile_picture);
      }

      const response = await axios.post("/staff", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response;
    } catch (error) {
      setStaffError(error);
      throw error; // ✅ rethrow so onSubmit catch block can handle it
    } finally {
      setStaffLoading(false);
    }
  };

  return { staffs, staffLoading, staffError, fetchStaffs, addStaff };
};

export default useStaffHook;
