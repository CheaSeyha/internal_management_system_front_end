import React, { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import VIP from "./components/VIP";
import { useReactToPrint } from "react-to-print";
import { toPng, toJpeg } from "html-to-image";
import { ImageDown, Printer } from "lucide-react";
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

  // Function to save a single card as image
  const saveCardAsImage = async (index) => {
    const element = document.getElementById(`card-${index}`);
    if (!element) return;

    try {
      const dataUrl = await toPng(element);
      const link = document.createElement("a");
      link.download = `${entries[index].name || `card-${index}`}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  // Function to save all cards
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only require image for Staff and Delivery cards
    const requiresImage = !["VIP Card", "Car Card"].includes(
      currentEntry.cardType
    );
    if (!currentEntry.name || (requiresImage && !currentEntry.imageFile)) {
      return alert(
        requiresImage ? "Name and Image are required." : "Name is required."
      );
    }

    // For VIP/Car cards, clear any existing image
    const entryToAdd = !requiresImage
      ? { ...currentEntry, imageFile: null, imagePreviewUrl: null }
      : currentEntry;

    setEntries((prev) => [...prev, entryToAdd]);
    setCurrentEntry({
      name: "",
      block: "",
      id: "",
      cardType: "Staff",
      imageFile: null,
      imagePreviewUrl: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
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

      <form
        onSubmit={handleSubmit}
        className="bg-base-200 rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Entry</h2>
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
              <label className="label">
                <span className="label-text">
                  {currentEntry.cardType === "Car Card"
                    ? "Plat Number"
                    : "Name"}
                </span>
              </label>
              <input
                name="name"
                value={currentEntry.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Block</span>
              </label>
              <input
                name="block"
                value={currentEntry.block}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div
              className={`form-control ${
                currentEntry.cardType === "Car Card" ? "hidden" : "block"
              }`}
            >
              <label className="label">
                <span className="label-text">ID</span>
              </label>
              <input
                name="id"
                value={currentEntry.id}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Card Type</span>
              </label>
              <select
                name="cardType"
                value={currentEntry.cardType}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option>Staff</option>
                <option>Delivery</option>
                <option>Car Card</option>
                <option>VIP Card</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4">
              Done
            </button>
          </div>
        </div>
      </form>
      {entries.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">All Cards</h3>
            <div className="btn-container space-x-2">
              <button
                onClick={saveAllCardsAsImages}
                className="btn bg-[#6dbb06]"
              >
                <ImageDown size={18} /> Export As Image
              </button>
              <button onClick={reactToPrintFn} className="btn bg-[#2dc1fc]">
                <Printer size={18} /> Print All Cards
              </button>
            </div>
          </div>

          <div
            className="grid grid-cols-2 place-items-center w-full gap-3 p-5"
            ref={contentRef}
          >
            {entries.map((entry, index) => (
              <div
                key={index}
                className={entry.cardType === "Car Card" ? "col-span-2" : ""}
                id={`card-${index}`}
              >
                <VIP
                  key={entry.name}
                  onRemove={removeEntryByName}
                  block={entry.block}
                  cardType={entry.cardType}
                  id={entry.id}
                  image={entry.imagePreviewUrl}
                  name={entry.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
