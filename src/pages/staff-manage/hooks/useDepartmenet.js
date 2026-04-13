import axios from "../../../api/axios";
import { useState } from "react";

const useDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      setLoading(true);
      const response = await axios.get("department");
      setDepartments(response.data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (department_name) => {
    setLoading(true);

    try {
      const res = await axios.post("department", {
        department_name,
      });

      return res.data;
    } catch (error) {
      throw error.response?.data; // ✅ MUST throw
    } finally {
      setLoading(false);
    }
  };

  const addPosition = async ({ department_name, position_name }) => {
    setLoading(true);

    try {
      const res = await axios.post("positions", {
        department_name,
        position_name,
      });

      return res.data;
    } catch (error) {
      throw error.response?.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    addDepartment,
    addPosition,
    loading,
    error,
    fetchDepartments,
  };
};

export default useDepartment;
