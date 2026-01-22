// ===============================
// /TableUser.jsx  (FULL CODE)
// ===============================
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import useStaffHook from "../Hooks/useStaffHook";

// ✅ Columns must match API fields
export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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

    { accessorKey: "id", header: "ID" },
    { accessorKey: "first_name", header: "First Name" },
    { accessorKey: "last_name", header: "Last Name" },

    // ✅ nested department
    {
        id: "department",
        header: "Department",
        accessorFn: (row) => row?.department?.department_name ?? "",
        cell: ({ getValue }) => <div className="capitalize">{getValue()}</div>,
    },

    // ✅ nested position
    {
        id: "position",
        header: "Position",
        accessorFn: (row) => row?.position?.position_name ?? "",
        cell: ({ getValue }) => <div>{getValue()}</div>,
    },

    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone_number", header: "Phone" },
    { accessorKey: "date_of_joining", header: "Date Joined" },
    { accessorKey: "date_of_birth", header: "DOB" },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const staffRow = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                onClick={() =>
                                    navigator.clipboard.writeText(String(staffRow.id))
                                }
                            >
                                Copy Staff ID
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                onClick={() =>
                                    navigator.clipboard.writeText(String(staffRow.email ?? ""))
                                }
                            >
                                Copy Email
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function TableUser() {
    const { staff, loading, error, refetch } = useStaffHook();

    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: staff,
        columns,
        getRowId: (row) => String(row.id),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // ✅ ERROR UI
    if (error) {
        return (
            <div className="p-4 space-y-3">
                <div className="text-red-500">Failed to load staff.</div>
                <Button onClick={refetch}>Try again</Button>
            </div>
        );
    }

    // ✅ SKELETON UI (Full table skeleton)
    if (loading) {
        const skeletonRows = Array.from({ length: 8 });

        return (
            <div className="w-full">
                <div className="overflow-hidden rounded-md border">
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
                            {skeletonRows.map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <TableCell key={col.id ?? col.accessorKey ?? colIndex}>
                                            <Skeleton
                                                className={`h-4 ${colIndex === 0
                                                    ? "w-4"
                                                    : colIndex === 1
                                                        ? "w-10"
                                                        : colIndex === 2 || colIndex === 3
                                                            ? "w-24"
                                                            : colIndex === 4 || colIndex === 5
                                                                ? "w-28"
                                                                : colIndex === 6
                                                                    ? "w-44"
                                                                    : "w-20"
                                                    }`}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    // ✅ NORMAL UI
    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-md border">
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
                                                header.getContext()
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
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default TableUser;
