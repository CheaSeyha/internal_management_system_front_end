import axios from "../../../api/axios";
import { useState } from "react";

const useDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
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

  return { departments, loading, error, fetchDepartments };
};

export default useDepartment;
