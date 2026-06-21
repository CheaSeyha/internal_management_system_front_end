import React, { useEffect, useState } from "react";
import DepartmentTable from "./components/DepartmentTable";
import useDepartment from "./hooks/useDepartmenet";
import DepartmentToolbar from "./components/DepartmentToolbar";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Departmenent() {
    const {
        departments,
        error,
        loading,
        fetchDepartments,
        addDepartment,
        addPosition,
        updatePosition,
        deletePosition,
        updateDepartment,
        deleteDepartment,
    } = useDepartment();
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [departmentToEdit, setDepartmentToEdit] = useState(null);
    const [editDepartmentName, setEditDepartmentName] = useState("");
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [editPositionName, setEditPositionName] = useState("");

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

    const handleDeleteDepartment = (department) => {
        setDepartmentToDelete(department);
    };

    const confirmDeleteDepartment = async () => {
        if (!departmentToDelete?.id) return;

        try {
            await deleteDepartment(departmentToDelete.id);
            await fetchDepartments();
            toast.success("Department deleted successfully");
            setDepartmentToDelete(null);
        } catch (error) {
            const message = error?.message || "Can't delete department";
            toast.error(message);
        }
    };

    const handleEditDepartment = (department) => {
        setDepartmentToEdit(department);
        setEditDepartmentName(department.department_name || "");
    };

    const submitEditDepartment = async () => {
        if (!departmentToEdit?.id || !editDepartmentName.trim()) return;

        try {
            await updateDepartment(departmentToEdit.id, editDepartmentName.trim());
            await fetchDepartments();
            toast.success("Department updated successfully");
            setDepartmentToEdit(null);
            setEditDepartmentName("");
        } catch (error) {
            const message =
                error?.errors?.department_name?.[0] ||
                error?.message ||
                "Can't update department";
            toast.error(message);
        }
    };

    const handlePositionClick = (departmentRow, positionName) => {
        setSelectedPosition({
            department_id: departmentRow.id,
            department_name: departmentRow.department_name,
            position_name: positionName.position_name,
        });
        setEditPositionName(positionName.position_name);
    };

    const submitEditPosition = async () => {
        if (!selectedPosition || !editPositionName.trim()) return;

        try {
            await updatePosition({
                department_id: selectedPosition.department_id,
                position_name: selectedPosition.position_name,
                new_position_name: editPositionName.trim(),
            });
            await fetchDepartments();
            toast.success("Position updated successfully");
            setSelectedPosition(null);
            setEditPositionName("");
        } catch (error) {
            const message =
                error?.errors?.position_name?.[0] ||
                error?.message ||
                "Can't update position";
            toast.error(message);
        }
    };

    const confirmDeletePosition = async () => {
        if (!selectedPosition) return;

        const positionToDelete = selectedPosition;
        setSelectedPosition(null); // close edit dialog

        toast("Delete Position?", {
            description: (
                <span>
                    Are you sure you want to delete{" "}
                    <strong>{positionToDelete.position_name}</strong> from{" "}
                    <strong>{positionToDelete.department_name}</strong>?
                </span>
            ),
            duration: 10000,
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deletePosition({
                            department_id: positionToDelete.department_id,
                            position_name: positionToDelete.position_name,
                        });
                        await fetchDepartments();
                        toast.success("Position deleted successfully");
                        setEditPositionName("");
                    } catch (error) {
                        const message = error?.message || "Can't delete position";
                        toast.error(message);
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        });
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
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
                onPositionClick={handlePositionClick}
            />

            <Dialog
                open={!!departmentToEdit}
                onOpenChange={(open) => {
                    if (!open) {
                        setDepartmentToEdit(null);
                        setEditDepartmentName("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>
                            Update department name.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label>Department Name</Label>
                        <Input
                            value={editDepartmentName}
                            onChange={(e) => setEditDepartmentName(e.target.value)}
                            placeholder="Enter department name"
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="button"
                            disabled={loading || !editDepartmentName.trim()}
                            onClick={submitEditDepartment}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!departmentToDelete}
                onOpenChange={(open) => !open && setDepartmentToDelete(null)}
            >
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{departmentToDelete?.department_name}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            disabled={loading}
                            onClick={confirmDeleteDepartment}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {/* Edit Or Delete Postion  */}
            <Dialog
                open={!!selectedPosition}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPosition(null);
                        setEditPositionName("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit or Delete Position</DialogTitle>
                        <DialogDescription>
                            Manage position in{" "}
                            <strong>{selectedPosition?.department_name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label>Position Name</Label>
                        <Input
                            value={editPositionName}
                            onChange={(e) => setEditPositionName(e.target.value)}
                            placeholder="Enter position name"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={loading}
                            onClick={confirmDeletePosition}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="button"
                            disabled={loading || !editPositionName.trim()}
                            onClick={submitEditPosition}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Departmenent;