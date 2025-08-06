import React, { useEffect, useState } from "react";
import { Funnel, Plus, Search, Ellipsis, Trash, Loader2 } from "lucide-react";
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
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "sonner";

const imageCache = {};

function SecureImage({ url, alt, className }) {
  const [src, setSrc] = useState(imageCache[url] || null);
  const [loading, setLoading] = useState(!imageCache[url]);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const res = await axios.get(url, { responseType: "blob" });
        const blobUrl = URL.createObjectURL(res.data);
        imageCache[url] = blobUrl;
        if (isMounted) setSrc(blobUrl);
      } catch (err) {
        console.error("Failed to load image:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (url && !imageCache[url]) fetchImage();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div className={`w-full h-full ${className}`}>
      {loading ? (
        <div className="skeleton w-full h-full rounded-full" />
      ) : (
        <img
          src={src || "/placeholder.png"}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
        />
      )}
    </div>
  );
}

function AllCards() {
  const [getCards, setGetCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/cards");
      setGetCards(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const allSelected =
    selectedCards.length === getCards.length && getCards.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCards([]);
    } else {
      setSelectedCards(getCards.map((c) => c));
    }
  };

  const toggleSelect = (card) => {
    setSelectedCards((prev) => {
      const exists = prev.some((c) => c.id === card.id);
      if (exists) return prev.filter((c) => c.id !== card.id);
      return [...prev, card];
    });
  };

  const handleBulkDelete = () => {
    if (selectedCards.length < 2) return; // Only trigger for 2 or more

    toast((t) => (
      <div>
        <p className="font-semibold text-red-500">
          Delete {selectedCards.length} selected cards?
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Card Type IDs: {selectedCards.map((c) => c.card_type_id).join(", ")}
        </p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              // 1️⃣ Dismiss confirmation toast
              toast.dismiss(t);

              // 2️⃣ Show new loading toast
              const loadingId = toast.loading("Deleting selected cards...");

              try {
                for (const card of selectedCards) {
                  await axios.delete(
                    `/card/delete/${card.card_type_id}/${card.card_type}`
                  );
                }

                // 3️⃣ Update state
                setGetCards((prev) =>
                  prev.filter(
                    (card) => !selectedCards.some((sel) => sel.id === card.id)
                  )
                );
                setSelectedCards([]);

                // 4️⃣ Update loading toast to success
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
        <p className="text-sm text-gray-700 mt-1">
          Card Type ID: {card.card_type_id} ({card.card_type})
        </p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              // 1️⃣ Close the confirmation toast first
              toast.dismiss(t);

              // 2️⃣ Show a new loading toast
              const loadingId = toast.loading("Deleting card...");

              try {
                await axios.delete(
                  `/card/delete/${card.card_type_id}/${card.card_type}`
                );

                setGetCards((prev) => prev.filter((c) => c.id !== card.id));
                setSelectedCards((prev) =>
                  prev.filter((c) => c.id !== card.id)
                );

                // 3️⃣ Update the loading toast to success
                toast.success(
                  `Deleted card ${card.card_type_id} successfully`,
                  {
                    id: loadingId,
                  }
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

  return loading ? (
    <LoadingSpinner />
  ) : (
    <main className="w-full space-y-5">
      {/* Search And Filter */}
      <section className="w-fit flex gap-2">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="search"
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
              <TableHead>Card ID</TableHead>
              <TableHead className="w-[100px]">Profile</TableHead>
              <TableHead>Card Type</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[150px] text-right">
                {selectedCards.length >= 2 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="w-[80px]">
                  <Checkbox
                    checked={selectedCards.some((c) => c.id === card.id)}
                    onCheckedChange={() => toggleSelect(card)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {card.card_type_id}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                    <SecureImage
                      url={card.profile_image_url}
                      alt={card.card_name}
                      className="w-full h-full"
                    />
                  </div>
                </TableCell>
                <TableCell>{card.card_type}</TableCell>
                <TableCell>{card.block}</TableCell>
                <TableCell>{card.card_name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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
            ))}
          </TableBody>
        </Table>
      </main>
    </main>
  );
}

export default AllCards;
