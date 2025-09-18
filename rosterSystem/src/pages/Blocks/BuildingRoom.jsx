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

export default function BuildingTable() {
  const { blocks, fetchBlocks, addBlock, addRoom, loading, fetching } =
    useBlocks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [buildingName, setBuildingName] = useState(""); // for Add Block
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(""); // for Add Room
  const [roomName, setRoomName] = useState("");

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
    { accessorKey: "count", header: "Room Count" },
    {
      accessorKey: "room",
      header: "Rooms",
      cell: ({ row }) =>
        row.getValue("room")?.length ? row.getValue("room").join(", ") : "-",
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
          <form onSubmit={handleAddBlock}>
            <DialogHeader>
              <DialogTitle>Add New Block</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 mt-3">
              <Label>Building Name</Label>
              <Input
                placeholder="Enter building name"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
            </div>
            <DialogFooter>
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
          <form onSubmit={handleAddRoom}>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 mt-3">
              <Label>Select Building</Label>
              <Select
                value={selectedBuilding}
                onValueChange={setSelectedBuilding}
              >
                <SelectTrigger>
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
            <DialogFooter>
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

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
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
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
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
    </div>
  );
}
