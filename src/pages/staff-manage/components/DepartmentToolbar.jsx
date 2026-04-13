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

function DepartmentToolbar({ onCreate, loading }) {
    const [departmentName, setDepartmentName] = useState("");
    const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
        if (!departmentName.trim()) return;

        await onCreate(departmentName);

        setDepartmentName("");
        setOpen(false); // ✅ close dialog
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>New Department</Button>
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
                        onClick={handleSubmit}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DepartmentToolbar;