// Updated MultiUploadForm with Crop Support
import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import StaffCard from "./components/StaffCard";
import DeliveryCard from "./components/DeliveryCard";

export default function CardGenerator() {
  const [currentEntry, setCurrentEntry] = useState({
    name: "",
    block: "",
    id: "",
    cardType: "Staff",
    imageFile: null,
    imagePreviewUrl: null,
  });

  const [entries, setEntries] = useState([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry((prev) => ({ ...prev, [name]: value }));
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
    const cropped = await getCroppedImg(rawImage.url, croppedAreaPixels);
    setCurrentEntry((prev) => ({
      ...prev,
      imagePreviewUrl: cropped.url,
      imageFile: cropped.file,
    }));
    setCropModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentEntry.name || !currentEntry.imageFile) {
      return alert("Name and Image are required.");
    }
    setEntries((prev) => [...prev, currentEntry]);
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
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setCropModalOpen(false)} className="btn">
                Cancel
              </button>
              <button onClick={applyCrop} className="btn btn-primary">
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
        <div
          className="flex flex-col md:flex-row gap-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex-1 border-2 border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center">
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

          <div className="flex-1 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                value={currentEntry.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
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
            <div className="form-control">
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
              Add Entry
            </button>
          </div>
        </div>
      </form>

      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">All Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry, index) => (
              <div key={index}>
                {entry.cardType === "Staff" ? (
                  <StaffCard
                    name={entry.name}
                    block={entry.block}
                    id={entry.id}
                    image={entry.imagePreviewUrl}
                  />
                ) : entry.cardType === "Delivery" ? (
                  <DeliveryCard
                    name={entry.name}
                    block={entry.block}
                    id={entry.id}
                    image={entry.imagePreviewUrl}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
