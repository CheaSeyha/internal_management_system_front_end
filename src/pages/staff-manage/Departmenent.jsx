import React, { useEffect } from "react";
import DepartmentTable from "./components/DepartmentTable";
import useDepartment from "./hooks/useDepartmenet";
import DepartmentToolbar from "./components/DepartmentToolbar";
import { toast } from "sonner"
function Departmenent() {
    const { departments, error, loading, fetchDepartments, addDepartment, addPosition } = useDepartment();

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        console.log(departments);
    }, [departments]);

    const addNewDepartment = async (departmentName) => {
        try {
            const res = await addDepartment(departmentName);

            await fetchDepartments();

            toast.success("New Department Created...");
            console.log(res);

        } catch (error) {
            const message =
                error?.errors?.department_name?.[0] ||
                error?.message ||
                "Can't create department";

            toast.error(message);
        }
    };

    const addNewPosition = async (departmentName, positionName) => {
        try {
            const res = await addPosition({
                department_name: departmentName,
                position_name: positionName,
            });

            await fetchDepartments();

            toast.success("New Position Created...");
            console.log(res);
        } catch (error) {
            const message =
                error?.errors?.position_name?.[0] ||
                error?.errors?.department_name?.[0] ||
                error?.message ||
                "Can't create position";

            toast.error(message);
        }
    };

    return (
        <>
            <div className="mb-5">
                <DepartmentToolbar
                    departments={departments}
                    onCreate={addNewDepartment}
                    onCreatePosition={addNewPosition}
                    loading={loading}
                />
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