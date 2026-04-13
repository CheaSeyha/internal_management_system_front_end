import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function DepartmentToolbar({ departments = [], onCreate, onCreatePosition, loading }) {
    const [departmentName, setDepartmentName] = useState("");
    const [positionName, setPositionName] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [openDepartmentDialog, setOpenDepartmentDialog] = useState(false);
    const [openPositionDialog, setOpenPositionDialog] = useState(false);

    const handleDepartmentSubmit = async () => {
        if (!departmentName.trim()) return;

        await onCreate(departmentName);

        setDepartmentName("");
        setOpenDepartmentDialog(false);
    };

    const handlePositionSubmit = async () => {
        if (!selectedDepartment || !positionName.trim()) return;

        await onCreatePosition(selectedDepartment, positionName);

        setPositionName("");
        setSelectedDepartment("");
        setOpenPositionDialog(false);
    };

    return (
        <div className="flex gap-2">
            {/* Add New Department  */}
            <Dialog open={openDepartmentDialog} onOpenChange={setOpenDepartmentDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline">New Department</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>New Department</DialogTitle>
                        <DialogDescription>
                            Create a new department for your system.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label>Department Name</Label>
                            <Input
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                                placeholder="Enter department name"
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            disabled={loading}
                            type="button"
                            onClick={handleDepartmentSubmit}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Add New Postion  */}
            <Dialog open={openPositionDialog} onOpenChange={setOpenPositionDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline">New Position</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>New Position</DialogTitle>
                        <DialogDescription>
                            Create a new Position for your system.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label>Department Name</Label>
                            <Select
                                value={selectedDepartment}
                                onValueChange={setSelectedDepartment}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {departments.map((item) => (
                                            <SelectItem
                                                key={item.department_id ?? item.department}
                                                value={item.department}
                                            >
                                                {item.department}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <Label>Position Name</Label>
                            <Input
                                value={positionName}
                                onChange={(e) => setPositionName(e.target.value)}
                                placeholder="Enter Position name"
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            disabled={loading || !selectedDepartment || !positionName.trim()}
                            type="button"
                            onClick={handlePositionSubmit}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DepartmentToolbar;