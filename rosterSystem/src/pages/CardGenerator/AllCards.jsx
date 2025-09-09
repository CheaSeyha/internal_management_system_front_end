import React, { useEffect, useRef, useState } from "react";
import {
  Funnel,
  Plus,
  Search,
  Ellipsis,
  Trash,
  Printer,
  Loader2,
  Pencil,
  RotateCcw,
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { NavLink } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useReactToPrint } from "react-to-print";
import PrintCard from "./components/PrintCard";

function AllCards() {
  // State management
  const [getCards, setGetCards] = useState([]);
  const [originalGetCards, setOriginalGetCards] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("no_filter");
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [isLoadingFilterOptions, setIsLoadingFilterOptions] = useState(false);

  // Fetch filter options when filter type changes

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (filter === "no_filter") {
        // reset back to original cards
        setGetCards(originalGetCards);
        setFilterOptions([]);
        setSelectedFilterValue("");
        return;
      }

      setIsLoadingFilterOptions(true);
      try {
        const endpoint =
          filter === "block"
            ? "blocks/all_buildings"
            : "/cards/get_all_card_type";

        const res = await axios.get(endpoint);

        const options =
          filter === "block"
            ? res.data.data.map((item) => item.building_name)
            : res.data.data;

        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
        setFilterOptions([]);
      } finally {
        setIsLoadingFilterOptions(false);
      }
    };

    fetchFilterOptions();
    console.log(getCards);
  }, [filter, originalGetCards]); // 👈 add originalGetCards so it resets correctly

  // Fetch cards data
  // const fetchCards = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get("/cards");
  //     if (response.data.success) {
  //       setGetCards(response.data.data.data || []);
  //       setOriginalGetCards(response.data.data.data || []);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const renderPageNumbers = () => {
    if (!pagination) return null;
    const { current_page, last_page } = pagination;
    const pages = [];

    const start = Math.max(1, current_page - 2);
    const end = Math.min(last_page, current_page + 2);

    if (start > 1) pages.push(1, "ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < last_page) pages.push("ellipsis", last_page);

    return pages.map((p, i) =>
      p === "ellipsis" ? (
        <PaginationEllipsis key={i} />
      ) : (
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={p === current_page}
            onClick={(e) => {
              e.preventDefault();
              fetchCards(p);
            }}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      )
    );
  };

  const fetchCards = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/cards?page=${page}`);
      if (response.data.success) {
        const data = response.data.data;

        setOriginalGetCards(data.data || []);
        setGetCards(data.data || []); // actual cards array
        setPagination(data); // full pagination object
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCards(1);
  }, []);

  const goToPage = (url) => {
    if (!url) return;
    const page = new URL(url).searchParams.get("page");
    fetchCards(page);
  };

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedFilterValue("");
  };

  // Handle filter value selection
  const handleFilterValueChange = (value) => {
    setSelectedFilterValue(value);
    filterData(searchValue, value);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filterData(value, selectedFilterValue);
  };

  // Combined filter function
  const filterData = async (searchTerm = "", filterVal = "") => {
    if (!searchTerm.trim() && !filterVal) {
      setGetCards(originalGetCards);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("card/cards_filter", {
        card_name: searchTerm,
        filter: filter,
        filterValue: filterVal,
      });
      if (res.data.success) {
        setGetCards(res.data.data);
      }
    } catch (error) {
      console.error(error);
      setGetCards(originalGetCards);
    } finally {
      setLoading(false);
    }
  };

  // Block parsing function
  function parseBlock(block) {
    if (!block) return "";
    if (Array.isArray(block)) return block.join("-");

    try {
      const parsed = JSON.parse(block);
      if (Array.isArray(parsed)) return parsed.join("-");
    } catch {
      // Not JSON, just return as is
    }

    return block;
  }

  // Selection handlers
  const allSelected =
    selectedCards.length === getCards.length && getCards.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCards([]);
    } else {
      setSelectedCards([...getCards]);
    }
  };

  const toggleSelect = (card) => {
    setSelectedCards((prev) => {
      const exists = prev.some((c) => c.id === card.id);
      if (exists) return prev.filter((c) => c.id !== card.id);
      return [...prev, card];
    });
  };

  // Delete handlers
  const handleBulkDelete = () => {
    if (selectedCards.length < 2) return;

    toast((t) => (
      <div>
        <p className="font-semibold text-red-500">
          Delete {selectedCards.length} selected cards?
        </p>
        <p className="text-sm mt-1">
          Card Type IDs: {selectedCards.map((c) => c.card_type_id).join(", ")}
        </p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t);
              const loadingId = toast.loading("Deleting selected cards...");

              try {
                for (const card of selectedCards) {
                  await axios.delete(
                    `/card/delete/${card.card_type_id}/${card.card_type}`
                  );
                }

                setGetCards((prev) =>
                  prev.filter(
                    (card) => !selectedCards.some((sel) => sel.id === card.id)
                  )
                );
                setSelectedCards([]);

                toast.success(
                  `Deleted ${selectedCards.length} cards successfully.`,
                  { id: loadingId }
                );
              } catch (error) {
                console.error("Bulk delete failed:", error);
                toast.error("Some cards failed to delete.", { id: loadingId });
              }
            }}
          >
            Yes, Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
        </div>
      </div>
    ));
  };

  const handleSingleDelete = (card) => {
    toast((t) => (
      <div>
        <p className="font-semibold text-red-500">Delete this card?</p>
        <p className="text-sm mt-1">
          Card Type ID: {card.card_type_id} ({card.card_type})
        </p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t);
              const loadingId = toast.loading("Deleting card...");

              try {
                await axios.delete(
                  `/card/delete/${card.card_type_id}/${card.card_type}`
                );

                setGetCards((prev) => prev.filter((c) => c.id !== card.id));
                setSelectedCards((prev) =>
                  prev.filter((c) => c.id !== card.id)
                );

                toast.success(
                  `Deleted card ${card.card_type_id} successfully`,
                  { id: loadingId }
                );
              } catch (error) {
                console.error("Delete failed:", error);
                toast.error("Failed to delete card.", { id: loadingId });
              }
            }}
          >
            Yes, Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
        </div>
      </div>
    ));
  };

  const restart = () => {
    fetchCards();
    setSelectedFilterValue("");
    setFilter("no_filter");
    setSearchValue("");
  };
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [cardToPrint, setCardToPrint] = useState(null);
  const [readyToPrint, setReadyToPrint] = useState(false);

  useEffect(() => {
    if (readyToPrint && cardToPrint) {
      reactToPrintFn();
      setReadyToPrint(false); // reset
    }
  }, [readyToPrint, cardToPrint]);

  const printCard = async (card) => {
    try {
      // 1️⃣ Fetch image
      let imageBlob = null;
      if (card.profile_image_url) {
        const response = await axios.get(card.profile_image_url, {
          responseType: "blob",
        });
        imageBlob = URL.createObjectURL(response.data);
      }

      // 2️⃣ Safely convert block
      let blockArray = card.block;
      if (typeof blockArray === "string") {
        try {
          blockArray = /^[\[{]/.test(blockArray)
            ? JSON.parse(blockArray)
            : [blockArray];
        } catch {
          blockArray = [blockArray]; // fallback to array with one value
        }
      }

      // 3️⃣ Set state
      setCardToPrint({ ...card, imageBlob, block: blockArray });

      // 4️⃣ Trigger print when ready
      setReadyToPrint(true);
    } catch (err) {
      console.error("Error in printCard:", err);
    }
  };

  return (
    <main className="w-full space-y-5">
      {/* Search And Filter */}
      <section className="w-fit flex flex-wrap md:flex-row gap-2 ">
        <div className="relative w-full md:w-[240px]">
          <Button
            onClick={() => filterData(searchValue, selectedFilterValue)}
            variant="ghost"
            className="absolute left-0 top-0 h-full px-3"
          >
            <Search className="h-4 w-4 text-gray-500" />
          </Button>
          <Input
            id="search"
            placeholder="Search, ID, Name..."
            className="pl-10"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        <Select onValueChange={handleFilterChange} value={filter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Funnel />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="no_filter">No filter</SelectItem>
              <SelectItem value="card_type">Card Type</SelectItem>
              <SelectItem value="block">Block</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Filter value selector */}
        {filter !== "no_filter" && (
          <Select
            onValueChange={handleFilterValueChange}
            value={selectedFilterValue}
            disabled={isLoadingFilterOptions || filterOptions.length === 0}
          >
            <SelectTrigger className="w-[180px]">
              {isLoadingFilterOptions ? (
                <span>Loading...</span>
              ) : (
                <>
                  <Funnel />
                  <SelectValue
                    placeholder={
                      filter === "block" ? "Select Block" : "Select Cards Type"
                    }
                  />
                </>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {filter === "block" ? "Select Block" : "Select Cards Type"}
                </SelectLabel>
                {filterOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Button variant="outline" onClick={restart}>
          <RotateCcw />
        </Button>
        <NavLink to={"/cards/card-generator"}>
          <Button className="bg-blue-500 text-accent-foreground">
            <Plus />
            Add Card
          </Button>
        </NavLink>
      </section>

      {/* Table */}
      <main className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-accent rounded-md">
            <TableRow>
              <TableHead className="w-[80px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Unique ID</TableHead>
              <TableHead>Card ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Card Type</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Create By</TableHead>
              <TableHead className="w-[100px] text-center">
                {(selectedCards.length >= 2 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <div className="relative inline-flex">
                      <Trash className="h-4 w-4 text-gray-300 left-0.5 bottom-0.5 relative" />
                      <Trash className="h-4 w-4 text-gray-300 absolute fill-[#a44d4e]" />
                    </div>
                  </Button>
                )) ||
                  "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(17)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell className="w-[80px]">
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-12 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="w-[100px] text-center">
                    <div className="w-8 h-4 mx-auto rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="w-[100px] text-center">
                    <div className="w-8 h-4 mx-auto rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : getCards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No cards found
                </TableCell>
              </TableRow>
            ) : (
              getCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="w-[80px]">
                    <Checkbox
                      checked={selectedCards.some((c) => c.id === card.id)}
                      onCheckedChange={() => toggleSelect(card)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{card.id}</TableCell>
                  <TableCell className="font-medium">
                    {card.card_type_id}
                  </TableCell>
                  <TableCell>{card.card_name}</TableCell>
                  <TableCell>{card.card_type}</TableCell>
                  <TableCell>{parseBlock(card.block)}</TableCell>
                  <TableCell>{card.create_by}</TableCell>
                  <TableCell className="w-[100px] text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className={
                          selectedCards.length >= 2 ? "hidden h-[20px]" : ""
                        }
                      >
                        <Button variant="ghost" size="20">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className=""
                          onClick={() => printCard(card)}
                        >
                          <Printer className="" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleSingleDelete(card)}
                        >
                          <Trash className="text-red-500" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </main>
      {/* paginatin  */}
      <div className="absolute bottom-4">
        <Pagination className="border-t mt-4 pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  fetchCards(
                    pagination.prev_page_url &&
                      new URL(pagination.prev_page_url).searchParams.get("page")
                  );
                }}
              />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  fetchCards(
                    pagination.next_page_url &&
                      new URL(pagination.next_page_url).searchParams.get("page")
                  );
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="hidden">
        {cardToPrint && <PrintCard entries={[cardToPrint]} ref={contentRef} />}
      </div>
    </main>
  );
}

export default AllCards;
