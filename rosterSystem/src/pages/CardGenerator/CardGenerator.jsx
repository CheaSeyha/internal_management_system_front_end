import React, { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import VIP from "./components/VIP";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { toPng, toJpeg } from "html-to-image";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function CardGenerator() {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [currentEntry, setCurrentEntry] = useState({
    name: "",
    block: "",
    id: "",
    cardType: "Staff",
    imageFile: null,
    imagePreviewUrl: null,
  });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const [entries, setEntries] = useState([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [noSpace, setNoSpace] = useState(true);

  //clear all cards
  const clearAllCards = () => {
    setEntries([]);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiresImage = !["VIP Card", "Car Card"].includes(
      currentEntry.cardType
    );
    if (!currentEntry.name || (requiresImage && !currentEntry.imageFile)) {
      return alert(
        requiresImage ? "Name and Image are required." : "Name is required."
      );
    }

    const entryToAdd = !requiresImage
      ? { ...currentEntry, imageFile: null, imagePreviewUrl: null }
      : currentEntry;

    if (editingIndex !== null) {
      // Update existing entry
      setEntries((prev) =>
        prev.map((entry, i) => (i === editingIndex ? entryToAdd : entry))
      );
      setEditingIndex(null);
    } else {
      // Add new entry
      setEntries((prev) => [...prev, entryToAdd]);
    }

    setCurrentEntry({
      name: "",
      block: "",
      id: "",
      cardType: "Staff",
      imageFile: null,
      imagePreviewUrl: null,
    });
  };

  // Add a cancel edit function
  const cancelEdit = () => {
    setEditingIndex(null);
    setCurrentEntry({
      name: "",
      block: "",
      id: "",
      cardType: "Staff",
      imageFile: null,
      imagePreviewUrl: null,
    });
  };
  const handleEdit = (index) => {
    // Check if there are unsaved changes in currentEntry
    if (currentEntry.name || currentEntry.imageFile) {
      if (
        !window.confirm(
          "You have unsaved changes. Do you want to discard them and edit this card?"
        )
      ) {
        return;
      }
    }

    setCurrentEntry(entries[index]);
    setEditingIndex(index);
  };
  // {`${changeLayout} ?  :
  return (
    <div
      className={
        changeLayout
          ? "max-w-4xl mx-auto p-4 space-y-6"
          : "grid grid-cols-1 lg:grid-cols-2 gap-5 p-5"
      }
    >
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
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
                  aspect={85 / 100}
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

      <motion.form
        layout
        onSubmit={handleSubmit}
        className="rounded-xl p-6 shadow-lg h-fit bg-sidebar"
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
          {currentEntry.cardType !== "VIP Card" &&
            currentEntry.cardType !== "Car Card" && (
              <div
                className="flex-1 border-2 border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {currentEntry.imagePreviewUrl ? (
                  <img
                    src={currentEntry.imagePreviewUrl}
                    alt="Preview"
                    className="w-[80%] h-[100%] object-contain"
                  />
                ) : (
                  <p className="text-center text-gray-500">
                    Drag & drop or Ctrl+V to paste image
                  </p>
                )}
              </div>
            )}

          <div
            className={`space-y-4 ${
              ["VIP Card", "Car Card"].includes(currentEntry.cardType)
                ? "w-full"
                : "flex-1"
            }`}
          >
            <div className="form-control">
              <label htmlFor="cardtype-select-trigger" className="label">
                <span className="label-text">Card Type</span>
              </label>
              <Select
                name="cardType"
                value={currentEntry.cardType}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {
                      name: "cardType",
                      value: value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-full" id="cardtype-select-trigger">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="TukTuk">TukTuk</SelectItem>
                    <SelectItem value="Car Card">Car Card</SelectItem>
                    <SelectItem value="VIP Card">VIP Card</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">
                  {currentEntry.cardType === "Car Card"
                    ? "Plate Number"
                    : "Name"}
                </span>
              </label>
              <Input
                autoComplete="username"
                name="name"
                id="name"
                value={currentEntry.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
                ref={nameInputRef}
              />
            </div>
            <div className="form-control">
              <label htmlFor="block" className="label">
                <span className="label-text">Block</span>
              </label>
              <Input
                name="block"
                id="block"
                value={currentEntry.block}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>

            <div
              className={`form-control ${
                currentEntry.cardType === "Car Card" ||
                currentEntry.cardType === "Construction"
                  ? "hidden"
                  : "block"
              }`}
            >
              <label htmlFor="id" className="label">
                <span className="label-text">ID</span>
              </label>
              <Input
                name="id"
                id="id"
                value={currentEntry.id}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 mt-4 text-white"
            >
              {editingIndex !== null ? "Update" : "Done"}
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
      {/* Preview card layout  */}
      <motion.div
        layout
        className="space-y-4"
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        <div className="flex justify-between items-center p-5 rounded-lg bg-sidebar">
          <h3 className="text-xl font-semibold">All Cards</h3>
          <div className="btn-container space-x-2">
            {/* Toggle noSpace */}
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

            {/* Toggle layout */}
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

            <Button
              onClick={clearAllCards}
              id="nospace"
              className="btn border-none bg-[#853ef8] text-white hover:bg-[#6630bd]"
            >
              <CopyX size={18} /> Clear
            </Button>
            <Button
              disabled={entries.length === 0}
              onClick={saveAllCardsAsImages}
              className="btn bg-[#6dbb06] text-white border-none hover:bg-[#427203]"
            >
              <ImageDown size={18} /> Export
            </Button>
            <Button
              disabled={entries.length === 0}
              onClick={reactToPrintFn}
              className="btn bg-[#2dc1fc] text-white border-none hover:bg-[#1a8bbd]"
            >
              <Printer size={18} /> Print
            </Button>
          </div>
        </div>

        {/* Preview and print the card layout  */}
        <div
          className="flex flex-wrap justify-center gap-0 p-5 w-full" // gap-0 as baseline
          ref={contentRef}
        >
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.name}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={
                  entry.cardType === "Car Card"
                    ? "w-full flex justify-center py-4"
                    : `w-auto ${
                        noSpace ? "-mx-[1.1px] -my-[2px]" : "mx-2 my-2"
                      }`
                }
                id={`card-${index}`}
              >
                <VIP
                  key={entry.name}
                  onRemove={removeEntryByName}
                  onEdit={handleEdit}
                  index={index}
                  block={entry.block}
                  cardType={entry.cardType}
                  id={entry.id}
                  image={entry.imagePreviewUrl}
                  name={entry.name}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
