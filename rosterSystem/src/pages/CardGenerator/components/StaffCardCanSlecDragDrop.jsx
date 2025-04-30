import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import getCroppedImg from "../../../utils/cropImage";
import nwc_logo from "../../../assets/logo/nwc logo.png";
import { useEffect, useRef } from "react";

function StaffCard() {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const pasteInputRef = useRef(null);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result);
            setShowCropper(true);
          };
          reader.readAsDataURL(file);
        }
      }
    };

    const pasteInput = pasteInputRef.current;
    if (pasteInput) {
      pasteInput.addEventListener("paste", handlePaste);
    }

    return () => {
      if (pasteInput) {
        pasteInput.removeEventListener("paste", handlePaste);
      }
    };
  }, []);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: { "image/*": [] },
  });

  const showCroppedImage = useCallback(async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(cropped);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  return (
    <>
      <div>StaffCard</div>
      <div className="w-[9cm] bg-white h-[6cm] relative">
        <div className="card-outline absolute w-full h-full p-[2px] flex justify-center items-center">
          <div className="main-card w-[100%] h-[100%] rounded-[14px] border-[#ffff00] border-[3px] outline outline-[#1e0030] multi-border">
            <div className="logo-text w-[2.5cm] pl-1 pt-0.5">
              <img src={nwc_logo} alt="" />
              <p className="text-yellow-400 transform scale-x-71 scale-y-120 origin-left absolute left-[2.53cm] top-[0.35cm] text-2xl text-outli font-bold text-stroke w-[9cm]">
                NEW WORLD CASINO-HOTEL
              </p>
            </div>
            <div className="permission text-[#fa5d5d] text-2xl font-bold ransform scale-x-71 scale-y-100 absolute top-[1.25cm] left-[1.74cm] w-full">
              <p>Permission Card In/Out</p>
              <div className="line w-[77%] h-[4px] rounded-full bg-blue-600"></div>
            </div>
            {/* card infor and picture  */}
            <div className="container-card-inforw-full flex gap-3 text-black font-bold">
              {/* Profile - unchanged layout */}
              <div
  {...getRootProps()}
  className="image-card w-[85px] h-[100px] border border-blue-500 ml-3 mt-5 cursor-pointer overflow-hidden relative"
  onClick={() => pasteInputRef.current?.focus()}
>
  {/* Hidden file input for drag & drop */}
  <input {...getInputProps()} />

  {/* Hidden input for paste events */}
  <input
    ref={pasteInputRef}
    type="text"
    className="absolute top-0 left-0 w-full h-full opacity-0 z-10"
    contentEditable={true}
    onPaste={(e) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result);
            setShowCropper(true);
          };
          reader.readAsDataURL(file);
        }
      }
    }}
  />

  {/* Display the image */}
  <img
    src={
      croppedImage
        ? croppedImage
        : "https://img.freepik.com/free-photo/portrait-successful-businesswoman-suit-smiling-looking-like-professional-camera-white-background_1258-89425.jpg?t=st=1745976893~exp=1745980493~hmac=cce27ca5d08cdff03cdf133ac2a5809184a6b4d0eaa9bf970775754b04d68085&w=996"
    }
    className="w-full h-full object-cover"
    alt="Profile"
  />
</div>


              <div className="infor pt-5">
                <p className="leading-tight">Name : Plaok Meas</p>
                <p className="leading-tight">Position : Dj</p>
                <p className="leading-tight">Block : N</p>
                <p className="leading-tight">ID No: 00001</p>
                <p className="leading-tight">Date Expire : Dec 31,2025</p>
              </div>
            </div>
            {/* Address  */}
            <div className="container-address flex justify-center items-center h-[40px]">
              <div className="address-infor bg-[#0b2754] absolute text-[9px] px-1 rounded-[3px] ransform scale-x-105 font-bold">
                <p>
                  National Road 1, Bavet Commune, Bavet City, Svay Rieng
                  Province
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropper && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-[90vw] max-w-[400px] h-[500px] flex flex-col justify-between">
            <div className="relative w-full h-[400px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={85 / 100}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={showCroppedImage}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Crop & Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffCard;
