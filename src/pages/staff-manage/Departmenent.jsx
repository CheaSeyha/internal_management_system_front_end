import React, { useEffect } from "react";
import DepartmentTable from "./components/DepartmentTable";
import useDepartment from "./hooks/useDepartmenet";
import DepartmentToolbar from "./components/DepartmentToolbar";
import { toast } from "sonner"
function Departmenent() {
    const { departments, error, loading, fetchDepartments, addDepartment } = useDepartment();

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        console.log(departments);
    }, [departments]);

    const addNewDepartment = async (departmentName) => {
        try {
            const res = await addDepartment(departmentName);
            fetchDepartments();
            toast.success("New Department Created...")
            console.log(res)
        } catch (error) {
            console.log(res)
            toast.error("Can't not create new Department")
        }
    };

    return (
        <>
            <div className="mb-5">
                <DepartmentToolbar onCreate={addNewDepartment} loading={loading} />
            </div>

            <DepartmentTable
                departments={departments}
                loading={loading}
                error={error}
            />
        </>
    );
}

export default Departmenent;