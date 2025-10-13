import React, { useEffect, useRef, useState } from "react";
import {
  Funnel,
  Plus,
  Search,
  Ellipsis,
  Trash,
  Printer,
  School,
  IdCard,
  RotateCcw,
  School2,
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
import { Badge } from "@/components/ui/badge";
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
import { MonthYearPicker } from "../../components/MonthYearPicker";

function AllCards() {
  // State management
  const [getCards, setGetCards] = useState([]);
  const [originalGetCards, setOriginalGetCards] = useState([]);
  const [originalPagination, setOriginalPagination] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("no_filter");
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [isLoadingFilterOptions, setIsLoadingFilterOptions] = useState(false);
  // Fetch filter options when filter type changes
  //pritn logic state
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [cardToPrint, setCardToPrint] = useState(null);
  const [multiCardToPrint, setMultiCardToPrint] = useState([]);
  const [readyToPrint, setReadyToPrint] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [date, setDate] = useState(new Date()); //get curretn date for date select component

  const handleSelectDate = (date) => {
    setDate(date);
  };

  useEffect(() => {
    console.log("Mothn " + (date.getMonth() + 1));
    console.log("Year " + date.getFullYear());
    fetchCards();
  }, [date]);
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

        const options = res.data.data || [];

        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
        setFilterOptions([]);
      } finally {
        setIsLoadingFilterOptions(false);
      }
    };

    fetchFilterOptions();
  }, [filter, originalGetCards]); // 👈 add originalGetCards so it resets correctly

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

  //Get Fetch Cards Fucntions
  const fetchCards = async (page = 1, searchTerm = "", filterVal = "") => {
    setLoading(true);
    try {
      let response;
      response = await axios.post(`/card/cards_filter?page=${page}`, {
        card_name: searchTerm,
        filter: filter,
        filterValue: filterVal || selectedFilterValue,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });

      // ✅ Check if API returned success
      if (response.data && response.data.success) {
        const data = response.data.data;
        const cards = Array.isArray(data) ? data : data.data;

        setGetCards(cards || []);
        setPagination(Array.isArray(data) ? null : data);

        if (!(filter && filter !== "no_filter") && !searchTerm) {
          setOriginalGetCards(cards || []);
          setOriginalPagination(Array.isArray(data) ? null : data);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(error.response.data?.message || "No cards found");
        setGetCards([]);
        setPagination(null);
      } else {
        console.error("Error fetching cards:", error);
        toast.error("Failed to fetch cards");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCards(1);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedFilterValue("");
    setGetCards(originalGetCards);
    setPagination(originalPagination);
  };

  // Handle filter value selection
  const handleFilterValueChange = (value) => {
    setSelectedFilterValue(value);
    fetchCards(1, searchValue, value); // ✅ page=1, searchTerm=searchValue, filterVal=value
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Reset to original cards when input is empty
    if (value.trim() === "" && filter === "no_filter") {
      setGetCards(originalGetCards);
      setPagination(originalPagination);
      return;
    }

    // Otherwise, do your search/filter API call if needed
    // filterData(value, selectedFilterValue);
  };

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
    fetchCards(1);
    setSelectedFilterValue("");
    setFilter("no_filter");
    setPagination(originalPagination);
    setSearchValue("");
    setSelectedCards([]);
  };

  useEffect(() => {
    if ((readyToPrint && cardToPrint) || multiCardToPrint) {
      reactToPrintFn();
      setReadyToPrint(false); // reset
    }
  }, [readyToPrint, cardToPrint]);

  const prepareCard = async (card) => {
    let imageBlob = null;
    if (card.profile_image_url) {
      const response = await axios.get(card.profile_image_url, {
        responseType: "blob",
      });
      imageBlob = URL.createObjectURL(response.data);
    }

    // Safely convert block
    let blockArray = card.block;
    if (typeof blockArray === "string") {
      try {
        if (/^[\[{]/.test(blockArray)) {
          blockArray = JSON.parse(blockArray);
        } else {
          blockArray = blockArray.split(",").map((b) => b.trim());
        }
      } catch {
        blockArray = [blockArray];
      }
    }

    return { ...card, imageBlob, block: blockArray };
  };

  // Sigle print card
  const printCard = async (e, card) => {
    e.preventDefault();
    setLoadingPrint(true);

    await new Promise((resolve) => setTimeout(resolve, 0)); // let UI update

    try {
      const preparedCard = await prepareCard(card);

      // 👇 keep your old state usage
      setCardToPrint(preparedCard);
      setReadyToPrint(true);
    } catch (err) {
      console.error("Error in printSingleCard:", err);
    } finally {
      setLoadingPrint(false);
    }
  };

  // Multiple Pritn Card
  const multiplePrint = async (cards) => {
    if (!Array.isArray(cards) || cards.length === 0) return;

    setLoadingPrint(true);

    // Let React render loading UI first
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      // Prepare all cards independently
      const preparedCards = await Promise.all(
        cards.map((card) => prepareCard(card))
      );

      // Update multiCardToPrint state
      setMultiCardToPrint(preparedCards);

      // Trigger readyToPrint AFTER state is updated
      setReadyToPrint(true);
    } catch (err) {
      console.error("Error in multiplePrint:", err);
    } finally {
      setLoadingPrint(false);
    }
  };

  window.onafterprint = () => {
    setReadyToPrint(false);
    setMultiCardToPrint([]);
  };

  return (
    <main className="w-full space-y-5">
      {/* Search And Filter */}
      <section className="w-fit flex flex-wrap md:flex-row gap-2 ">
        <div className="relative w-full md:w-[240px]">
          <Button
            onClick={() => fetchCards(1, searchValue, selectedFilterValue)} // ✅ use unified fetchCards
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
          <SelectTrigger className="w-full md:w-fit">
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

        <MonthYearPicker value={date} onChange={handleSelectDate} />

        {/* Filter value selector */}
        {filter !== "no_filter" && (
          <Select
            onValueChange={handleFilterValueChange}
            value={selectedFilterValue}
            disabled={isLoadingFilterOptions || filterOptions.length === 0}
          >
            <SelectTrigger className="w-fit">
              {isLoadingFilterOptions ? (
                <span>Loading...</span>
              ) : (
                <>
                  {filter === "block" ? <School2 /> : <IdCard />}
                  <SelectValue
                    placeholder={
                      filter === "block" ? "Select Block" : "Select Cards Type"
                    }
                  />
                </>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="h-[250px]">
                <SelectLabel>
                  {filter === "block" ? "Select Block" : "Select Cards Type"}
                </SelectLabel>
                {filterOptions.map((item, index) => {
                  const key =
                    filter === "block" ? item.building : item.card_type;
                  const value = key;
                  const count = item.count ?? item.count_card ?? 0; // adapt to your API

                  return (
                    <SelectItem
                      key={`${key}-${index}`}
                      value={value}
                      className="flex justify-between items-center"
                    >
                      <>
                        <span>
                          {filter === "block" ? item.building : item.card_type}
                        </span>

                        <Badge
                          className="h-5 min-w-5 rounded-full bg-blue-500 text-white dark:bg-blue-600 font-mono tabular-nums"
                          variant="secondary"
                        >
                          {count}
                        </Badge>
                      </>
                    </SelectItem>
                  );
                })}
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
              <TableHead>Date</TableHead>
              <TableHead>Create By</TableHead>
              <TableHead className="w-[100px] text-center">
                {(selectedCards.length >= 2 && (
                  <div className="flex gap-1">
                    <Button
                      className="bg-[#077bff] hover:bg-[#035fc7] active:bg-[#035fc7] flex items-center justify-center"
                      variant="secondary"
                      size="sm"
                      onClick={() => multiplePrint(selectedCards)}
                      disabled={loadingPrint || readyToPrint} // disable while loading or printing
                    >
                      {loadingPrint ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        </div>
                      ) : (
                        <div className="relative inline-flex">
                          <Printer className="h-4 w-4 text-gray-300 left-0.5 bottom-0.5 relative" />
                          <Printer className="h-4 w-4 text-gray-300 absolute fill-[#077bff]" />
                        </div>
                      )}
                    </Button>

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
                  </div>
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
                  <TableCell>{card.blocks_string}</TableCell>
                  <TableCell>{card.created_at}</TableCell>
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
                          onClick={(e) => printCard(e, card)}
                          disabled={loadingPrint}
                        >
                          {loadingPrint ? (
                            <>
                              <Printer className="" />
                              Printing...
                            </>
                          ) : (
                            <>
                              <Printer className="" />
                              Print
                            </>
                          )}
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

      <div className="hidden">
        {multiCardToPrint.length > 0 && (
          <PrintCard entries={multiCardToPrint} ref={contentRef} />
        )}
      </div>
    </main>
  );
}

export default AllCards;
