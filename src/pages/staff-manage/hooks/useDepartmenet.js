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

  const findPositionMeta = async ({ department_id, position_name }) => {
    const res = await axios.get("positions");
    const groups = res?.data?.data || [];

    for (const group of groups) {
      if (Number(group.department_id) !== Number(department_id)) continue;

      const matched = (group.positions || []).find(
        (item) => item.position_name === position_name,
      );

      if (matched) {
        return {
          position_id: matched.position_id,
          department_id: group.department_id,
          department_name: group.department_name,
        };
      }
    }

    throw { message: "Position not found" };
  };

  const updatePosition = async ({
    department_id,
    position_name,
    new_position_name,
  }) => {
    setLoading(true);

    try {
      const meta = await findPositionMeta({ department_id, position_name });
      const res = await axios.put(`positions/${meta.position_id}`, {
        department_name: meta.department_name,
        position_name: new_position_name,
      });

      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const deletePosition = async ({ department_id, position_name }) => {
    setLoading(true);

    try {
      const meta = await findPositionMeta({ department_id, position_name });
      const res = await axios.delete(
        `positions/${meta.position_id}/${meta.department_id}`,
      );

      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (department_id, department_name) => {
    setLoading(true);

    try {
      const res = await axios.put(`department/${department_id}`, {
        department_name,
      });

      return res.data;
    } catch (error) {
      throw error.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (department_id) => {
    setLoading(true);

    try {
      const res = await axios.delete(`department/${department_id}`);
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
    updatePosition,
    deletePosition,
    updateDepartment,
    deleteDepartment,
    loading,
    error,
    fetchDepartments,
  };
};

export default useDepartment;
