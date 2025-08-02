import React from "react";
import {
  WalletCards,
  Funnel,
  Plus,
  Search,
  Ellipsis,
  Trash,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { NavLink } from "react-router-dom";

function AllCards() {
  return (
    <main className="w-full p-5 space-y-5">
      {/* Tittle  */}
      <nav className="w-full flex items-center gap-2">
        <WalletCards className="text-blue-700 text-2xl" />
        <h1 className="text-lg font-bold">All Access Cards</h1>
      </nav>
      {/* Search And Filter Button  */}
      <section className="w-fit flex gap-2">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id={"search"}
            placeholder="Search, ID, Name..."
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <Funnel />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter By</SelectLabel>
              <SelectItem value="card_name">Card Name</SelectItem>
              <SelectItem value="card_id">Card ID</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <NavLink to={"/cards/card-generator"}>
          <Button className="bg-blue-500 text-accent-foreground">
            <Plus />
            Add Card
          </Button>
        </NavLink>
      </section>

      {/* tbale data  */}
      <main className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-accent rounded-md">
            <TableRow>
              <TableHead className="w-[80px]">
                <Checkbox />
              </TableHead>
              <TableHead>Card ID</TableHead>
              <TableHead className="w-[100px]">Profile</TableHead>
              <TableHead>Card Type</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="w-[80px]">
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">00234</TableCell>
              <TableCell className="font-medium">
                <div className="w-[30px] rounded-full overflow-hidden">
                  <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                </div>
              </TableCell>
              <TableCell>Construction</TableCell>
              <TableCell>X2</TableCell>
              <TableCell>SA MAO</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-blue-500">
                      <Pencil className="text-blue-500" />
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      <Trash className="text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>
    </main>
  );
}

export default AllCards;
