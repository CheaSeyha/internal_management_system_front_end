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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Shield } from "lucide-react";
import ImageDropzoneHoverRemove from "../../../components/ImageDropzoneHoverRemove";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import useDepartment from "../hooks/useDepartmenet";
export function AddStaffDialog() {
  const [selectDepartment, setSelectDepartment] = useState(null);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const { departments, fetchDepartments } = useDepartment();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSelectDepartment = (department) => {
    setSelectDepartment(department);
  };

  useEffect(() => {
    console.log(isCreateUser);
  }, [isCreateUser]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            New Staff
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Please Fill Infor For New Staff
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full rounded-md">
            <div className="flex flex-col gap-6">
              <ImageDropzoneHoverRemove />
              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* First Name  */}
                <Field>
                  <Label htmlFor="first-name-1">First Name</Label>
                  <Input
                    id="first-name-1"
                    name="first-name"
                    placeholder="e.g John"
                  />
                </Field>
                {/* Last Name  */}
                <Field>
                  <Label htmlFor="last-name-1">Last Name</Label>
                  <Input
                    id="last-name-1"
                    name="last-name"
                    placeholder="e.g Doe"
                  />
                </Field>
                {/* Email  */}
                <Field>
                  <Label htmlFor="email-1">Email</Label>
                  <Input
                    id="email-1"
                    name="email"
                    placeholder="demo@gamil.com"
                  />
                </Field>
                {/* Phone  */}
                <Field>
                  <Label htmlFor="phone-1">Phone</Label>
                  <Input
                    id="phone-1"
                    name="phone"
                    placeholder="e.g 1234567890"
                  />
                </Field>
                {/* Staff ID  */}
                <Field>
                  <Label htmlFor="staff-id-1">Staff ID</Label>
                  <Input
                    id="staff-id-1"
                    name="staff-id"
                    placeholder="e.g 1882"
                  />
                </Field>
                {/* Lable ID  */}
                <Field>
                  <Label htmlFor="label-id-1">Label ID</Label>
                  <Input
                    id="label-id-1"
                    name="label-id"
                    placeholder="e.g HR1882"
                  />
                </Field>
                {/* Gender  */}
                <Field>
                  <Label htmlFor="gender-1">Gender</Label>
                  <Select defaultValue="male">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem key="male" value="male">
                          Male
                        </SelectItem>
                        <SelectItem key="female" value="female">
                          Female
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* Create Login User  */}
                <Field>
                  <Label htmlFor="gender-1">Create User Login</Label>
                  <Field
                    orientation="horizontal"
                    className="border w-full h-full ps-2 rounded-lg"
                  >
                    <Checkbox
                      checked={isCreateUser}
                      onCheckedChange={(e) => setIsCreateUser(e)}
                      id="terms-checkbox"
                      name="terms-checkbox"
                    />
                    <Label
                      htmlFor="terms-checkbox"
                      className="text-[10px] font-light"
                    >
                      Staff Can Use This Account To login
                    </Label>
                  </Field>
                </Field>
                {/* User Role And Password  */}
                {isCreateUser && (
                  <>
                    <Field>
                      <Label htmlFor="user-role-1">User Role</Label>
                      <Select defaultValue="user">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem
                              key="super-admin"
                              value="super-admin"
                              className="text-green-500"
                            >
                              Super Admin
                            </SelectItem>
                            <SelectItem
                              key="admin"
                              value="admin"
                              className="text-blue-500"
                            >
                              Admin
                            </SelectItem>
                            <SelectItem
                              key="user"
                              value="user"
                              className="text-gray-500"
                            >
                              User
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <Label htmlFor="password-1">Password</Label>
                      <Input
                        id="password-1"
                        name="password"
                        type="password"
                        placeholder="*********"
                      />
                      <FieldDescription className="text-[10px] font-light">
                        Password Must Be At Least 8 Characters Long
                      </FieldDescription>
                    </Field>
                  </>
                )}
                {/* Department  */}
                <Field>
                  <Label htmlFor="department-1">Department</Label>
                  <Select
                    value={selectDepartment || undefined}
                    onValueChange={handleSelectDepartment}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {departments.map((item) => (
                          <SelectItem
                            key={item.department}
                            value={item.department}
                          >
                            {item.department}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* Position  */}
                <Field>
                  <Label htmlFor="position-1">Position</Label>
                  <Select
                    disabled={!selectDepartment}
                    key={selectDepartment || "position-select"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(() => {
                          const positions =
                            departments.find(
                              (item) => item.department === selectDepartment,
                            )?.positions || [];

                          if (positions.length === 0) {
                            return (
                              <SelectItem key="none" value="none" disabled>
                                No Position Available
                              </SelectItem>
                            );
                          }

                          return positions.map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ));
                        })()}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
