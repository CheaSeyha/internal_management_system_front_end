import { useEffect, useState } from "react";
import axios from "../../../api/axios";

const useDepartmentHook = () => {
    const [departments, setDepartments] = useState([]);
    const [loadingDepartment, setLoadingDepartment] = useState(false);
    const [errorDepartment, setErrorDepartment] = useState(null);

    const fetchDepartment = async () => {
        try {
            setLoadingDepartment(true);
            setErrorDepartment(null);

            const res = await axios.get("department/all_departments");
            console.log("Departments API response:", res.data);

            // Handle Laravel-style data wrapping or direct array response
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setDepartments(data);
        } catch (err) {
            console.error("Error fetching departments:", err);
            setErrorDepartment(err);
            setDepartments([]);
        } finally {
            setLoadingDepartment(false);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, []);

    return {
        departments,
        loadingDepartment,
        errorDepartment,
    };
};

export default useDepartmentHook
