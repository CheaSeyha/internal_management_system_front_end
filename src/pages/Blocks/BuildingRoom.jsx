"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useBlocks from "./Hook/useBlocks";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
export default function BuildingTable() {
  const {
    blocks,
    fetchBlocks,
    addBlock,
    addRoom,
    deleteRoom,
    loading,
    fetching,
    deleteLoading,
  } = useBlocks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [buildingName, setBuildingName] = useState(""); // for Add Block
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(""); // for Add Room
  const [roomName, setRoomName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState({ room: "", building: "" });

  // Function called when confirming delete
  const handleConfirmDelete = async () => {
    // deleteRoom sets deleteLoading=true, runs operation, then sets deleteLoading=false.
    const success = await deleteRoom(roomToDelete.room, roomToDelete.building);

    // We now only check for success. If successful, we close the dialog.
    if (success) {
      setDeleteDialogOpen(false);
      setRoomToDelete({ room: "", building: "" });
    }
    // If NOT successful (success === false), the dialog remains open,
    // and deleteLoading is already false (re-enabling the button).
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  // --- Add Block ---
  const handleAddBlock = async (e) => {
    e.preventDefault();
    const newBlock = await addBlock(buildingName);
    if (newBlock) {
      setBuildingName("");
      setDialogOpen(false);
      fetchBlocks();
    }
  };

  // --- Add Room ---
  const handleAddRoom = async (e) => {
    e.preventDefault();
    const success = await addRoom(selectedBuilding, roomName);
    if (success) {
      setRoomName("");
      setSelectedBuilding("");
      setAddRoomOpen(false);
      fetchBlocks();
    }
  };

  // --- Table state ---
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    { accessorKey: "building", header: "Building" },
    {
      accessorKey: "room",
      header: "Rooms",
      cell: ({ row }) => {
        const rooms = row.getValue("room");
        const building = row.original.building;

        if (!rooms?.length) return "-";

        return (
          <div className="flex flex-wrap gap-2">
            {rooms.map((roomName, idx) => (
              <button
                key={idx}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                onClick={() => {
                  setRoomToDelete({ room: roomName, building });
                  setDeleteDialogOpen(true);
                }}
              >
                {roomName}
              </button>
            ))}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: blocks,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0, // start from first page
        pageSize: 50, // default 50 rows per page
      },
    },
  });

  return (
    <div className="w-full">
      {/* Add Block Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-2">
            Add Block
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Block</DialogTitle>
            <DialogDescription>
              Enter the name of the building you want to add.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBlock}>
            <div className="grid gap-3 mt-3">
              <Label>Building Name</Label>
              <Input
                placeholder="Enter building name"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Room Dialog */}
      <Dialog open={addRoomOpen} onOpenChange={setAddRoomOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4 ml-2">
            Add Room
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Select a building and enter the room name.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoom}>
            <div className="grid gap-3 mt-3">
              <Label>Select Building</Label>
              <Select
                value={selectedBuilding}
                onValueChange={setSelectedBuilding}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((b) => (
                    <SelectItem key={b.building} value={b.building}>
                      {b.building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 mt-3">
              <Label>Room Name / Number</Label>
              <Input
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <DialogFooter className="flex mt-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete room */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription>
            Are you sure you want to delete room{" "}
            <span className="font-bold text-red-500">{roomToDelete.room}</span>{" "}
            of building{" "}
            <span className="font-bold text-red-500">
              {roomToDelete.building}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // Prevent the default Radix UI closure behavior on click.
                // This allows us to control the closure manually in the async function.
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table */}
      {/* Table */}
      <div className="rounded-md border h-full">
        {/* Table header stays fixed if needed */}
        <div className="overflow-y-auto max-h-[700px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {fetching ? (
                // Skeleton placeholder while loading
                Array.from({
                  length: table.getState().pagination.pageSize,
                }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                // Actual table data
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                // No results
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
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between space-x-2 py-3 px-3">
          <div className="flex-1 text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </div>

          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
