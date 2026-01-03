import React, { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import VIP from "./components/VIP";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { toPng, toJpeg } from "html-to-image";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  ImageDown,
  Printer,
  ChevronsRightLeft,
  ChevronsLeftRight,
  CopyX,
  Columns2,
  Rows2,
  Eye,
  EyeOff,
  RotateCcw,
  LucideTrash2,
  ArrowUpDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../api/axios";
import { useCardHook } from "./components/Hook/useCardHook";
import useISPHook from "../Internet/Hook/useISPHook";
import BlockSelect from "./components/BlockSelect";
export default function CardGenerator() {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [currentEntry, setCurrentEntry] = useState({
    name: "",
    block: [],
    id: "",
    isp_name: "",
    isp_position: "",
    rolling_link: "",
    cardType: "",
    imageFile: null,
    imagePreviewUrl: null,
  });
  const [entries, setEntries] = useState([]);
  // Crop State---------------------
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [noSpace, setNoSpace] = useState(true);
  const [loading, setloading] = useState(false);
  const [isAutoAlignEnabled, setIsAutoAlignEnabled] = useState(true);
  // Crop State---------------------
  //Hide Card State-----------------------------------------
  const [hideCard, setHideCard] = useState([]);
  const [showCardHidden, setShowCardHidden] = useState(false);
  const [ready, setReady] = useState(false); //for select card type logic ro render when fetch data done
  const [searchText, setSearchText] = useState(""); // for search box in select blocks

  //Hide Card State-----------------------------------------
  const [keepSameBlocks, setKeepSameBlocks] = useState(false); //for store block the same when add new card
  const { cardTypes, loadings, error } = useCardHook();
  const { isps, fetchISPs } = useISPHook();

  // 🔹 Create a ref for the search box in select blocks
  const searchInputRef = React.useRef(null);

  //Hide Card State-----------------------------------------
  const handelHideCard = (id, cardType) => {
    // find the entry in entries state
    const entryToHide = entries.find(
      (e) => e.id === id && e.cardType === cardType
    );

    if (!entryToHide) return; // safety check if not found

    setHideCard((prev) => {
      // check if already hidden
      const exists = prev.some(
        (hidden) =>
          hidden.id === entryToHide.id &&
          hidden.cardType === entryToHide.cardType
      );

      if (exists) {
        // if exists, remove it (unhide)
        return prev.filter(
          (hidden) =>
            hidden.id !== entryToHide.id ||
            hidden.cardType !== entryToHide.cardType
        );
      }

      // if not exists, add it (hide)
      return [...prev, entryToHide];
    });
  };
  //Hide Logic---------------------------------------------

  //clear all cards
  const clearAllCards = () => {
    setEntries([]);
    setHideCard([]);
  };
  const [blocks, setBlocks] = useState([]);

  const fetchBlocks = async () => {
    try {
      const res = await axios.get("blocks/all_buildings");
      if (res.status === 200) {
        setBlocks(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
      toast.error("Failed to fetch blocks", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  useEffect(() => {
    fetchBlocks();
    fetchISPs();
  }, []);

  const [selectedBlocks, setSelectedBlocks] = useState([]);

  const handleAddBlock = (value) => {
    const [building, ...roomParts] = value.split("-");
    const room = roomParts.join("-"); // room can contain dashes now

    setCurrentEntry((prev) => {
      // Create a shallow copy of the blocks array
      const updatedBlocks = [...(prev.block || [])];

      const buildingIndex = updatedBlocks.findIndex(
        (b) => b.building === building
      );

      if (!room) {
        // Select whole building
        if (buildingIndex === -1) {
          updatedBlocks.push({ building, rooms: [] });
        } else {
          // Update existing building to verify 'all rooms' selection
          // Create a new object for this building
          updatedBlocks[buildingIndex] = { ...updatedBlocks[buildingIndex], rooms: [] };
        }
      } else {
        // Select a specific room
        if (buildingIndex === -1) {
          updatedBlocks.push({ building, rooms: [room] });
        } else {
          const existingBuilding = updatedBlocks[buildingIndex];
          const rooms = [...existingBuilding.rooms]; // Copy rooms array

          if (!rooms.includes(room)) {
            rooms.push(room);
            // Update the building with the new rooms array
            updatedBlocks[buildingIndex] = { ...existingBuilding, rooms: rooms };
          }
        }
      }

      return { ...prev, block: updatedBlocks };
    });

    setSearchText("");
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleRemoveBlock = (building, room = null) => {
    setCurrentEntry((prev) => {
      const updatedBlocks = prev.block
        .map((b) => {
          if (b.building !== building) return b;
          if (!room) return null; // remove entire building

          const newRooms = b.rooms.filter((r) => r !== room);
          // If no rooms left, remove the building entry entirely to avoid switching to "Select Whole Building" mode
          if (newRooms.length === 0) return null;

          return { ...b, rooms: newRooms };
        })
        .filter(Boolean);
      return { ...prev, block: updatedBlocks };
    });
  };

  const availableBlocks = blocks
    .map((b) => b.building)
    .filter((name) => !selectedBlocks.includes(name));

  const [changeLayout, setLayout] = useState(() => {
    const saved = localStorage.getItem("cardgen-layout");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("cardgen-layout", changeLayout);
  }, [changeLayout]);

  const setNoSpaceCard = () => {
    setNoSpace((prevNoSpace) => !prevNoSpace);
  };
  // Function to save a single card as image
  const saveCardAsImage = async (index) => {
    const element = document.getElementById(`card-${index}`);
    if (!element) return;

    try {
      // Get the actual dimensions of your card
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      // Scale up for better quality (2x or 3x)
      const scale = 2;

      const dataUrl = await toPng(element, {
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        },
        quality: 1, // Maximum quality
        pixelRatio: scale, // Handle high DPI screens
      });

      const link = document.createElement("a");
      link.download = `${entries[index].name || `card-${index}`}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  // Function to save all cards with better quality
  const saveAllCardsAsImages = async () => {
    for (let i = 0; i < entries.length; i++) {
      await saveCardAsImage(i);
      // Small delay between saves to avoid issues
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Function to remove entry by name
  const removeEntryByName = (nameToRemove) => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.name !== nameToRemove)
    );
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setRawImage({ file, url: imageUrl });
      setCropModalOpen(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          handleImageFile(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const applyCrop = async () => {
    const cropped = await getCroppedImg(rawImage.url, croppedAreaPixels, {
      brightness,
      contrast,
      saturation,
    });

    setCurrentEntry((prev) => ({
      ...prev,
      imagePreviewUrl: cropped.url,
      imageFile: cropped.file,
    }));
    setCropModalOpen(false);
  };

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editingIndex !== null && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingIndex]);

  // Habdle Add or Edit Card --------------------------------------------
  // Helper function to format blocks as string
  function formatBlocks(blockArray) {
    if (!Array.isArray(blockArray) || blockArray.length === 0) return "";
    return blockArray.join(",");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiresImage = !["VIP CARD", "CAR CARD"].includes(
      currentEntry.cardType
    );

    // Validation
    if (!currentEntry.name || (requiresImage && !currentEntry.imageFile)) {
      if (requiresImage) {
        toast.error("Name and Image are required.");
        return;
      }
    }

    if (currentEntry.cardType.toLocaleLowerCase() === "isp" && (currentEntry.isp_name === "" || currentEntry.isp_position === "")) {
      toast.error("Please Select ISP Name and Position...");
      return;
    }

    if (currentEntry.cardType.toLocaleLowerCase() === "rolling" || currentEntry.cardType.toLocaleLowerCase() === "isp") {
      // Allow skipping block
    } else if (
      !currentEntry.block ||
      String(currentEntry.block).trim() === ""
    ) {
      toast.error("Block is required...");
      return;
    }

    setloading(true);

    // Convert selected blocks array to merged string like "P-103-105,S1"
    // const blockString = formatBlocks(currentEntry.block || selectedBlocks);

    // Prepare entry to add/update
    const entryToAdd = !requiresImage
      ? { ...currentEntry, imageFile: null, imagePreviewUrl: null }
      : currentEntry;

    try {
      const formData = new FormData();
      formData.append("card_name", currentEntry.name);
      formData.append("block", JSON.stringify(currentEntry.block)); // ✅ merged string
      formData.append("card_type", currentEntry.cardType);
      formData.append("isp_name", currentEntry.isp_name);
      formData.append("isp_position", currentEntry.isp_position);
      formData.append("link", currentEntry.rolling_link);
      if (currentEntry.imageFile)
        formData.append("profile_image", currentEntry.imageFile);

      // Add ISP or Rolling specific fields if present
      if (editingIndex !== null) {
        // Edit existing card
        const originalCard = entries[editingIndex];
        setSelectedBlocks(originalCard.block || []);

        const isTypeChanged = currentEntry.cardType !== originalCard.cardType;

        if (isTypeChanged) {
          // Delete original and create new card
          const deleteOriginalCard = await axios.delete(
            `card/delete/${originalCard.id}/${originalCard.cardType}`
          );

          if (deleteOriginalCard.status === 200) {
            setEntries((prev) => prev.filter((_, i) => i !== editingIndex));

            const res = await axios.post("/create_card", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const getCardID = res.data.data.card_type_id;
            const entryWithID = { ...entryToAdd, id: getCardID };

            setEntries((prev) => [...prev, entryWithID]);
            toast.success("New card created due to type change!");
          }
        } else {
          // Same type: update card
          await axios.post(
            `/card/edit/${originalCard.id}/${currentEntry.cardType}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          setEntries((prev) =>
            prev.map((entry, i) => (i === editingIndex ? entryToAdd : entry))
          );
          toast.success("Card updated successfully!");
        }

        setEditingIndex(null);
      } else {
        // Create new card
        const res = await axios.post("/create_card", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const getCardID = res.data.data.card_type_id;
        const entryWithID = { ...entryToAdd, id: getCardID };

        setEntries((prev) => [...prev, entryWithID]);
        toast.success("Card added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save card!", {
        description: error.response.data.errors.card_type,
      });
    } finally {
      setloading(false);

      setCurrentEntry({
        name: "",
        block: keepSameBlocks ? [...currentEntry.block] : [],
        id: "",
        cardType: currentEntry.cardType,
        isp_name: currentEntry.isp_name,
        isp_position: "",
        rolling_link: "",
        imageFile: null,
        imagePreviewUrl: null,
      });

      // also clear the selected blocks state if not keeping them
      if (!keepSameBlocks) {
        setSelectedBlocks([]);
      }
    }
  };

  // Habdle Add or Edit Card --------------------------------------------

  // Add a cancel edit function
  const cancelEdit = () => {
    setEditingIndex(null);
    setCurrentEntry({
      name: "",
      block: [],
      id: "",
      cardType: currentEntry.cardType,
      isp_name: "",
      isp_position: "",
      rolling_link: "",
      imageFile: null,
      imagePreviewUrl: null,
    });

    setSelectedBlocks([]);
  };

  const handleEdit = (index) => {
    if (currentEntry.name || currentEntry.imageFile) {
      toast.warning(
        "You have unsaved changes. Please save or discard them first."
      );
      return;
    }

    const card = entries[index];
    const blocks = Array.isArray(card.block)
      ? card.block
      : card.block
        ? JSON.parse(card.block)
        : [];

    setSelectedBlocks(blocks);

    setCurrentEntry({
      ...card,
      block: blocks,
    });

    setEditingIndex(index);
  };

  useEffect(() => {
    if (!loadings && cardTypes.length > 0) {
      setCurrentEntry({ cardType: cardTypes[0].card_type }); // set first value
      setReady(true); // now we can render the Select
    }
  }, [loadings, cardTypes]);

  const removeProfileImage = () => {
    setCurrentEntry((prev) => ({
      ...prev,
      imageFile: null,
      imagePreviewUrl: null,
    }));
  };

  if (!ready) return <LoadingSpinner />; // show loading until ready
  return (
    <div
      className={
        changeLayout
          ? "max-w-4xl mx-auto p-4 space-y-6"
          : "grid grid-cols-1 lg:grid-cols-2 gap-5 p-5"
      }
    >
      {cropModalOpen && (
        <div className="fixed h-screen inset-0 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
          <div className="bg-base-200 p-4 rounded-lg shadow-xl w-full max-w-lg">
            <div className="relative h-80 bg-black">
              <div
                className="absolute inset-0"
                style={{
                  filter: `
                    brightness(${brightness}%)
                    contrast(${contrast}%)
                    saturate(${saturation}%)
                  `,
                }}
              >
                <Cropper
                  image={rawImage.url}
                  crop={crop}
                  zoom={zoom}
                  aspect={1 / 1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="label-text font-medium text-sm">Zoom</label>
                  <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
                    {zoom.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="range range-primary range-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="label-text font-medium text-sm">
                    Brightness
                  </label>
                  <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
                    {brightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  step={1}
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="range range-warning range-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="label-text font-medium text-sm">
                    Contrast
                  </label>
                  <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
                    {contrast}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  step={1}
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="range range-secondary range-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="label-text font-medium text-sm">
                    Saturation
                  </label>
                  <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
                    {saturation}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  step={1}
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="range range-accent range-sm"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <button
                className="btn btn-error flex-1"
                onClick={() => {
                  setBrightness(100);
                  setContrast(100);
                  setSaturation(100);
                }}
              >
                Reset Adjustments
              </button>

              <button
                onClick={() => setCropModalOpen(false)}
                className="btn btn-warning flex-1"
              >
                Cancel
              </button>

              <button onClick={applyCrop} className="btn btn-primary flex-1">
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="h-full w-full">
        <motion.form
          layout
          onSubmit={handleSubmit}
          className="rounded-xl p-6 m-auto shadow-lg h-fit w-[700px] mb-5 bg-sidebar"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
          <div className="relative w-fit m-auto mb-4">
            <motion.div
              // Animate the gradient background for the glow
              animate={{
                background: [
                  "linear-gradient(90deg, #ef4444, #3b82f6, #f59e0b)",
                  "linear-gradient(90deg, #f59e0b, #ef4444, #3b82f6)",
                  "linear-gradient(90deg, #3b82f6, #f59e0b, #ef4444)",
                  "linear-gradient(90deg, #ef4444, #3b82f6, #f59e0b)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 blur-[20px] opacity-50 pointer-events-none rounded-lg z-0"
              style={{
                background: "linear-gradient(90deg, #ef4444, #3b82f6, #f59e0b)",
              }}
            />
            <motion.h2
              className="relative text-3xl font-bold text-center w-fit m-auto z-10 bg-clip-text text-transparent"
              initial={{
                background: "linear-gradient(90deg, #ef4444, #3b82f6, #f59e0b)",
                backgroundClip: "text",
                color: "rgba(0,0,0,0)", // Use rgba(0,0,0,0) instead of "transparent"
                backgroundSize: "200% 200%",
              }}
              animate={{
                background: [
                  "linear-gradient(90deg, #ef4444, #3b82f6, #f59e0b)",
                  "linear-gradient(90deg, #f59e0b, #ef4444, #3b82f6)",
                  "linear-gradient(90deg, #3b82f6, #f59e0b, #ef4444)",
                  "linear-gradient(90deg, #ef4444, #3b82f6, #f59e0b)",
                ],
                backgroundClip: "text",
                color: "rgba(0,0,0,0)", // Consistent with initial value
                backgroundSize: "200% 200%",
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Card Generator
            </motion.h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Show Image  */}
            {currentEntry.cardType !== "VIP CARD" &&
              currentEntry.cardType !== "CAR CARD" && (
                <div
                  className="flex-1 border-2 border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {currentEntry.imagePreviewUrl ? (
                    <div className="relative flex justify-center items-center group">
                      <div
                        className="
                         absolute inset-0
                         flex justify-center items-center
                         bg-black/20
                         backdrop-blur-none
                         opacity-0
                         pointer-events-none
                         transition-all duration-300 ease-out
                         group-hover:opacity-100
                         group-hover:backdrop-blur-sm
                         group-hover:pointer-events-auto"
                      >
                        <Button
                          onClick={() => removeProfileImage()}
                          type="button"
                          className="bg-red-500 text-white cursor-pointer"
                        >
                          <LucideTrash2 />
                        </Button>
                      </div>

                      <img
                        src={currentEntry.imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      Drag & drop or Ctrl+V to paste image
                    </p>
                  )}
                </div>
              )}

            <div
              className={`space-y-4 ${["VIP CARD", "CAR CARD"].includes(currentEntry.cardType)
                ? "w-full"
                : "flex-1"
                }`}
            >
              {/* select card type  */}
              <div className="form-control">
                <label className="label flex flex-col items-start">
                  <span className="label-text mb-1">Card Type</span>

                  <Select
                    name="cardType"
                    value={currentEntry.cardType || ""}
                    onValueChange={(value) =>
                      setCurrentEntry((prev) => ({ ...prev, cardType: value }))
                    }
                  >
                    <SelectTrigger className="w-full cursor-pointer bg-white text-black dark:text-white border border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>

                    <SelectContent className="text-black dark:text-white">
                      <SelectGroup>
                        {cardTypes.map((card) => (
                          <SelectItem
                            key={card.card_type}
                            value={card.card_type}
                            className="cursor-pointer hover:bg-gray-100 focus:bg-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-600"
                          >
                            {card.card_type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </label>
              </div>

              {/* Card Naem  */}
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text mb-2">
                    {currentEntry.cardType === "CAR CARD"
                      ? "Plate Number"
                      : "Name"}
                  </span>
                </label>
                <Input
                  autoComplete="username"
                  name="name"
                  id="name"
                  value={currentEntry.name || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                  ref={nameInputRef}
                />
              </div>
              {/* Block select  */}
              {/* check if rolling user can skip select block  */}
              {(currentEntry.cardType !== "ISP" && currentEntry.cardType !== "ROLLING") ? (
                <>
                  <BlockSelect
                    blocks={blocks}
                    onSelect={handleAddBlock}
                    onRemove={handleRemoveBlock}
                    selectedBlocks={currentEntry.block}
                  />
                </>
              ) :
                currentEntry.cardType === "ISP" ? (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Select ISP</span>
                      </label>
                      <Select
                        name="isp_name"
                        value={currentEntry.isp_name || ""}
                        onValueChange={(value) =>
                          setCurrentEntry((prev) => ({ ...prev, isp_name: value }))
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-black dark:text-white border border-gray-300 dark:border-gray-700">
                          <SelectValue placeholder="Select ISP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {isps.map((isp) => (
                              <SelectItem key={isp.id} value={isp.isp_name} className="cursor-pointer">
                                {isp.isp_name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">ISP Position</span>
                      </label>
                      <Input
                        name="isp_position"
                        value={currentEntry.isp_position || ""}
                        onChange={handleInputChange}
                        placeholder="Position"
                        className="input input-bordered w-full"
                        list="isp-positions"
                      />
                      <datalist id="isp-positions">
                        <option value="Sale" />
                        <option value="Fiber" />
                        <option value="IT Support" />
                      </datalist>
                    </div>
                  </>
                ) : currentEntry.cardType === "ROLLING" ? (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Link</span>
                    </label>
                    <Input
                      name="rolling_link"
                      value={currentEntry.rolling_link || ""}
                      onChange={handleInputChange}
                      placeholder="Enter link for rolling"
                      className="input input-bordered w-full"
                    />
                  </div>
                ) : (
                  <>
                    <p>Generic Card - No additional fields</p>
                  </>
                )}
              {/* button for save card or update card  */}
              <Button
                type="submit"
                className="w-full bg-blue-500 mt-4 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-md mr-2"></span>
                    {editingIndex !== null ? "Updating..." : "Saving..."}
                  </>
                ) : editingIndex !== null ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
              {editingIndex !== null && (
                <Button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full bg-red-500 mt-2 text-white"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </motion.form>
      </div>

      {/* Preview card layout  */}

      <motion.div
        layout
        className="space-y-4"
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        {/* Button conrtoller  */}
        <div className="flex justify-between items-center p-5 rounded-lg bg-sidebar">
          <h3 className="text-xl font-semibold">All Cards</h3>
          <div className="btn-container space-x-2">
            {/* Toggle noSpace */}
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  htmlFor="toggle-no-space"
                  className="swap bg-[#f508a6] hover:bg-[#990367] w-[40px] h-[40px] rounded-full active:scale-105 transition-all duration-200"
                >
                  <input
                    id="toggle-no-space"
                    type="checkbox"
                    checked={noSpace}
                    onChange={setNoSpaceCard}
                    className="hidden"
                  />

                  <div className="swap-on text-white">
                    <ChevronsLeftRight size={18} />
                  </div>
                  <div className="swap-off text-white">
                    <ChevronsRightLeft size={18} />
                  </div>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>No Space Card</p>
              </TooltipContent>
            </Tooltip>
            {/* Toggle layout */}

            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  htmlFor="toggle-layout"
                  className="swap bg-[#2dc1fc] hover:bg-[#1e7699] w-[40px] h-[40px] rounded-full active:scale-105 transition-all duration-200"
                >
                  <input
                    id="toggle-layout"
                    type="checkbox"
                    checked={changeLayout}
                    onChange={() => setLayout((prev) => !prev)}
                    className="hidden"
                  />

                  <div className="swap-on text-white">
                    <Columns2 size={18} />
                  </div>
                  <div className="swap-off text-white">
                    <Rows2 size={18} />
                  </div>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Layout</p>
              </TooltipContent>
            </Tooltip>

            {/* Toggle Auto Align */}
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  htmlFor="toggle-auto-align"
                  className="swap bg-[#ff9900] hover:bg-[#cc7a00] w-[40px] h-[40px] rounded-full active:scale-105 transition-all duration-200"
                >
                  <input
                    id="toggle-auto-align"
                    type="checkbox"
                    checked={isAutoAlignEnabled}
                    onChange={() => setIsAutoAlignEnabled((prev) => !prev)}
                    className="hidden"
                  />
                  {/* swap-on: Visible when checked (Auto Align ON) */}
                  <div className="swap-on text-white flex items-center justify-center">
                    <ArrowUpDown size={18} />
                  </div>
                  {/* swap-off: Visible when unchecked (Auto Align OFF) */}
                  <div className="swap-off text-white flex items-center justify-center">
                    <ArrowUpDown size={18} className="opacity-50" />
                  </div>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auto Align All Card Types</p>
              </TooltipContent>
            </Tooltip>
            {/*Toggle Hide/Show Card  */}

            {/* Show Button When Card Hidden  */}
            {/* Button show hidden card  */}
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  htmlFor="toggle-hidden"
                  className="swap bg-[#3b3d3d] hover:bg-[#636464] w-[40px] h-[40px] rounded-full active:scale-105 transition-all duration-200"
                >
                  <input
                    id="toggle-hidden"
                    type="checkbox"
                    checked={showCardHidden}
                    onChange={() => setShowCardHidden((prev) => !prev)}
                    className="hidden"
                  />

                  {/* when ON (show hidden cards) */}
                  <div className="swap-on text-white flex items-center justify-center">
                    <Eye size={18} />
                  </div>

                  {/* when OFF (hide hidden cards) */}
                  <div className="swap-off text-white flex items-center justify-center">
                    <EyeOff size={18} />
                  </div>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide/Show Card</p>
              </TooltipContent>
            </Tooltip>
            <Button
              onClick={clearAllCards}
              id="nospace"
              className="btn border-none bg-[#853ef8] text-white hover:bg-[#6630bd]"
            >
              <CopyX size={18} /> Clear
            </Button>
            <Button
              disabled={entries.length === 0 || showCardHidden}
              onClick={saveAllCardsAsImages}
              className="btn bg-[#6dbb06] text-gray-800 dark:text-white border-none hover:bg-[#427203]"
            >
              <ImageDown size={18} /> Export
            </Button>
            <Button
              disabled={entries.length === 0 || showCardHidden}
              onClick={reactToPrintFn}
              className="btn bg-[#2dc1fc] text-gray-800 dark:text-white border-none hover:bg-[#1a8bbd]"
            >
              <Printer size={18} /> Print
            </Button>
          </div>
        </div>

        {/* Preview and print the card layout  */}
        <div
          className={`flex flex-wrap justify-center gap-0 p-5 w-full ${entries.length > 1
            ? "print:justify-start"
            : "print:justify-center"
            }`}

          ref={contentRef}
        >
          <AnimatePresence>
            {showCardHidden ? (
              // Show all hidden cards
              hideCard.length === 0 ? (
                <>
                  <p>No Hidden Card</p>
                </>
              ) : (
                hideCard.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={
                      entry.cardType === "CAR CARD"
                        ? "w-full flex justify-center py-4"
                        : `w-auto ${noSpace ? "-mx-[1.1px] -my-[2px]" : "mx-10 my-11"
                        }`
                    }
                    id={`card-${index}`}
                  >
                    <div className="grayscale">
                      <VIP
                        key={entry.id}
                        onRemove={removeEntryByName}
                        onEdit={handleEdit}
                        onHideCard={() =>
                          handelHideCard(entry.id, entry.cardType)
                        }
                        index={index}
                        block={entry.block}
                        cardType={entry.cardType}
                        id={entry.id}
                        image={entry.imagePreviewUrl}
                        name={entry.name}
                        isp_name={entry.isp_name}
                        isp_position={entry.isp_position}
                        rolling_link={entry.rolling_link}
                      />
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              // Show visible cards only
              entries
                .filter(
                  (entry) =>
                    !hideCard.some(
                      (hidden) =>
                        hidden.id === entry.id &&
                        hidden.cardType === entry.cardType
                    )
                )
                .sort((a, b) =>
                  isAutoAlignEnabled
                    ? (a.cardType || "").toLowerCase().localeCompare((b.cardType || "").toLowerCase())
                    : 0
                )
                .map((entry, index) => {
                  const originalIndex = entries.indexOf(entry);
                  return (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className={
                        entry.cardType === "CAR CARD"
                          ? "w-full flex justify-center py-4 print:border-y print:border-dashed print:border-blue-600"
                          : entry.cardType === "VIP CARD"
                            ? noSpace
                              ? "-mx-[2.5px] -my-[0.5px]"
                              : "mx-[0.5px] my-[0.5px]"
                            : noSpace
                              ? "-mx-[0.5px] -my-[1.5px]"
                              : "mx-[0.5px] my-[0.5px]"
                      }
                      id={`card-${originalIndex}`}
                    >
                      <VIP
                        key={entry.id}
                        onRemove={removeEntryByName}
                        onEdit={handleEdit}
                        onHideCard={() =>
                          handelHideCard(entry.id, entry.cardType)
                        }
                        index={originalIndex}
                        block={entry.block}
                        cardType={entry.cardType}
                        id={entry.id}
                        image={entry.imagePreviewUrl}
                        name={entry.name}
                        isp_name={entry.isp_name}
                        isp_position={entry.isp_position}
                        rolling_link={entry.rolling_link}
                      />
                    </motion.div>
                  );
                }))
            }
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
