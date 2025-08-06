import React, { useEffect, useState } from "react";
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

// ==================== SecureImage Component with DaisyUI Skeleton ====================
const imageCache = {}; // simple in-memory cache

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
        imageCache[url] = blobUrl; // cache for next time
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

// ==================== Main Component ====================
function AllCards() {
  const [getCards, setGetCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/cards");
      console.log("Fetched cards:", response.data);
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

  return loading ? (
    <LoadingSpinner/>
  ) : (
    <main className="w-full space-y-5">
      {/* Search And Filter Button  */}
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

      {/* Table data */}
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
            {getCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="w-[80px]">
                  <Checkbox />
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
            ))}
          </TableBody>
        </Table>
      </main>
    </main>
  );
}

export default AllCards;
