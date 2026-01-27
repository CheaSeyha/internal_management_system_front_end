"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  ChevronDown,
  MoreHorizontal,
  RefreshCcw,
  User,
} from "lucide-react";
import useStaffHook from "../Hooks/useStaffHook";
import AddStaffDialog from "./AddStaffDialog";

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

  // ✅ Photo with fallback icon
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
            // if image fails, hide it (optional)
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
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "staff_status",
    header: "Staff Status",
    cell: ({ row }) => (
      <div
        className={`capitalize w-fit h-fit ${row.getValue("staff_status") === "active" ? "bg-green-500" : "bg-red-700"}  rounded-2xl px-2 text-white`}
      >
        {row.getValue("staff_status")}
      </div>
    ),
  },

  {
    id: "actions",
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

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                disabled={!r.user_id}
                onClick={() =>
                  r.user_id && navigator.clipboard.writeText(String(r.user_id))
                }
              >
                Copy User ID
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                onClick={() => navigator.clipboard.writeText(String(r.id))}
              >
                Copy Staff ID
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                onClick={() =>
                  navigator.clipboard.writeText(String(r.email ?? ""))
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
  const {
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

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

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

    // ✅ IMPORTANT: use staff id, not user_id (because user_id can be null)
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

  return (
    <div className="w-full">
      {/* Button controller  */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter email..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="action-buttonn flex items-center gap-2">
          <AddStaffDialog onSuccess={refetch} />
          <Button variant="outline" onClick={refetch}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
      {/* table show data  */}
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

      {/* ✅ SERVER PAGINATION */}
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
    </div>
  );
}

export default TableUser;
