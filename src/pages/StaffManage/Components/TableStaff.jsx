import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import useStaffHook from "../Hooks/useStaffHook";
import AddStaffDialog from "./AddStaffDialog";
import usePositionHook from "../Hooks/usePositionHook";
import useDepartmentHook from "../Hooks/useDepartmentHook";
import MultiSelectDynamic from "../../../components/MultiSelectDynamic";
import UpdateStaffDialog from "./UpdateStaffDialog";
import { toast } from "sonner";

export function TableUser() {
  const [selectedDepartments, setSelectedDepartments] = React.useState([]);
  const [selectedPositions, setSelectedPositions] = React.useState([]);

  // Update dialog state
  const [openUpdateStaff, setOpenUpdateStaff] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteStaff, setSelectedDeleteStaff] = useState(null);

  const position = usePositionHook();
  const department = useDepartmentHook();

  const {
    handleDeleteStaff,
    rows,
    loading,
    error,
    refetch,
    page,
    lastPage,
    total,
    nextPage,
    prevPage,
    goToPage,
  } = useStaffHook();

  useEffect(() => {
    console.log("Staff Data", rows);
  }, [rows]);

  const filteredPositionOptions = React.useMemo(() => {
    if (selectedDepartments.length === 0) {
      return (position.position || [])
        .filter((p) => p.position_name)
        .map((p) => ({ value: p.position_name, label: p.position_name }));
    }
    return (position.position || [])
      .filter((p) => {
        const deptName = p.department?.department_name;
        return deptName && selectedDepartments.includes(deptName);
      })
      .map((p) => ({ value: p.position_name, label: p.position_name }));
  }, [position.position, selectedDepartments]);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "photo",
        header: "Photo",
        cell: ({ row }) => {
          const src = row.original.photoSrc;
          return src ? (
            <img
              src={src}
              alt="profile"
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          );
        },
      },
      {
        accessorKey: "label_id",
        header: "ID",
        cell: ({ row }) => (
          <div className="uppercase">{row.getValue("label_id")}</div>
        ),
      },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "department_name",
        header: "Department",
        cell: ({ row }) => (
          <div className="uppercase">{row.getValue("department_name")}</div>
        ),
      },
      {
        accessorKey: "position_name",
        header: "Position",
        cell: ({ row }) => (
          <div className="uppercase">{row.getValue("position_name")}</div>
        ),
      },
      { accessorKey: "phone_number", header: "Phone" },
      { accessorKey: "date_of_joining", header: "Date of Joining" },
      { accessorKey: "date_of_birth", header: "Date of Birth" },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
      },
      {
        accessorKey: "staff_status",
        header: "Staff Status",
        cell: ({ row }) => (
          <div
            className={`capitalize w-fit h-fit ${
              row.getValue("staff_status") === "active"
                ? "bg-green-500"
                : "bg-red-700"
            } rounded-2xl px-2 text-white`}
          >
            {row.getValue("staff_status")}
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-2">Actions</DropdownMenuLabel>

                  {/* Delete — e.preventDefault() so dropdown doesn't fight AlertDialog */}
                  <DropdownMenuCheckboxItem
                    className="text-red-500 p-2"
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedDeleteStaff(r);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
                  </DropdownMenuCheckboxItem>

                  {/* Update — e.preventDefault() so dropdown doesn't fight Dialog */}
                  <DropdownMenuCheckboxItem
                    className="text-blue-500 p-2"
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedStaff(r);
                      setOpenUpdateStaff(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Update Staff
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const getPageNumbers = (current, totalPages) => {
    const delta = 2;
    const pages = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(totalPages, current + delta);
    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const table = useReactTable({
    data: rows,
    columns,
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  if (error) {
    return (
      <div className="p-4 space-y-3">
        <div className="text-red-500">Failed to load staff.</div>
        <div className="text-sm text-muted-foreground break-words">{error}</div>
        <Button onClick={refetch}>Try again</Button>
      </div>
    );
  }

  const handleDeleteStaffSingle = async () => {
    try {
      const res = await handleDeleteStaff(selectedDeleteStaff?.staff_id);
      if (res.status === 200) {
        toast.success("Staff deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete staff");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteStaff(null);
      refetch();
    }
  };

  return (
    <div className="w-full">
      {/* Filters + Actions */}
      <div className="flex gap-2">
        <Input
          placeholder="Filter email..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="action-buttonn flex items-center gap-2">
          <MultiSelectDynamic
            loading={department.loadingDepartment}
            options={department.departments.map((dep) => ({
              value: dep.department_name,
              label: dep.department_name,
            }))}
            placeholder="Select Department"
            value={selectedDepartments}
            onValueChange={(next) => {
              setSelectedDepartments(next);
              console.log(next);
            }}
          />
          {selectedDepartments.length > 0 && (
            <MultiSelectDynamic
              loading={position.loadingPosition}
              options={filteredPositionOptions}
              placeholder="Select position"
              value={selectedPositions}
              onValueChange={(next) => {
                setSelectedPositions(next);
                console.log(next);
              }}
            />
          )}
          <AddStaffDialog onSuccess={refetch} />
          <Button variant="outline" onClick={refetch}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border mt-4 h-[700px]">
        {loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, idx) => (
                  <TableHead key={col.id ?? col.accessorKey ?? idx}>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 12 }).map((_, r) => (
                <TableRow key={r}>
                  {columns.map((col, c) => (
                    <TableCell key={col.id ?? col.accessorKey ?? c}>
                      <Skeleton className="h-10 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 gap-2 flex-wrap">
        <div className="text-muted-foreground text-sm">
          Page {page} of {lastPage} • {total} records
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={page <= 1}
          >
            Previous
          </Button>
          {getPageNumbers(page, lastPage).map((p, idx) =>
            p === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(p)}
                className="min-w-[36px]"
              >
                {p}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={page >= lastPage}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete AlertDialog — controlled by selectedDeleteStaff */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(v) => {
          setDeleteDialogOpen(v);
          if (!v) setSelectedDeleteStaff(null); // clear on close
        }}
      >
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-bold text-red-500">
              {selectedDeleteStaff?.name}
            </span>{" "}
            (ID:{" "}
            <span className="font-bold text-red-500">
              {selectedDeleteStaff?.label_id}
            </span>
            )? This action cannot be undone.
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </AlertDialogCancel>

            {/* Use Button instead of AlertDialogAction */}
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={loading}
              onClick={handleDeleteStaffSingle}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Dialog — controlled by selectedStaff */}
      <UpdateStaffDialog
        open={openUpdateStaff}
        onOpenChange={(v) => {
          setOpenUpdateStaff(v);
          if (!v) setSelectedStaff(null);
        }}
        staffData={selectedStaff}
        onSuccess={refetch}
      />
    </div>
  );
}

export default TableUser;
