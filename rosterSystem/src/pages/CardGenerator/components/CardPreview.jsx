import React, { useEffect, useRef, useState } from "react";
import vipcard from "../../../assets/CardTamplete/VIP.png";
import staffcard from "../../../assets/CardTamplete/STAFF.png";
import deliverycard from "../../../assets/CardTamplete/DELIVERY.png";
import tuktuk from "../../../assets/CardTamplete/TUKTUK.png";
import carcard1 from "../../../assets/CardTamplete/CAR1.png";
import construction from "../../../assets/CardTamplete/CONSTRUCTION.png";
import { Trash, Edit, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
function CardPreview({
  name,
  block,
  id,
  image,
  cardType,
  onRemove,
  onEdit,
  onHideCard,
  index,
}) {
  const normalizedCardType = cardType?.toLowerCase() || "";

  function formatBlocks(blocks) {
    if (!Array.isArray(blocks) || blocks.length === 0) return "";

    const hasRoom = blocks.some(({ rooms }) => rooms && rooms.length > 0);

    if (!hasRoom) {
      // All blocks have empty rooms → concatenate building names
      return blocks.map(({ building }) => building).join("");
    } else {
      // Some blocks have rooms → show Building-Room or Building, separated by commas
      return blocks
        .map(({ building, rooms }) => {
          if (!rooms || rooms.length === 0) return building;
          return rooms.map((room) => `${building}-${room}`).join(",");
        })
        .join(", ");
    }
  }

  const formattedBlock = formatBlocks(block); // ✅ call the function

  const [fontSizeName, setFontSizeName] = useState(18);
  const nameRef = useRef();
  const platRef = useRef();
  const DEFAULT_FONT_SIZE_CM = 1.6;
  const [platFontSize, setPlatFontSize] = useState(DEFAULT_FONT_SIZE_CM);
  const MAX_TEXT_WIDTH_PX = 310; // maximum width in px

  const [lineHight, setLineHight] = useState(0);

  useEffect(() => {
    if (!platRef.current) return;

    // Start with default font size
    let fontSize = DEFAULT_FONT_SIZE_CM;
    platRef.current.style.fontSize = `${fontSize}cm`;

    let textWidth = platRef.current.getBoundingClientRect().width;

    // Reduce font size until text fits MAX_TEXT_WIDTH_PX
    while (textWidth > MAX_TEXT_WIDTH_PX && fontSize > 0.5) {
      fontSize -= 0.05;
      platRef.current.style.fontSize = `${fontSize}cm`;
      textWidth = platRef.current.getBoundingClientRect().width;
    }

    setPlatFontSize(fontSize);
  }, [name]);

  useEffect(() => {
    if (normalizedCardType === "construction") setFontSizeName(16);
    if (normalizedCardType === "delivery" || normalizedCardType === "tuktuk")
      setFontSizeName(17);

    if (name.length >= 20) setLineHight(2);
    else setLineHight(0);

    if (nameRef.current) {
      const width = nameRef.current.getBoundingClientRect().width;
      if (width > 134 && fontSizeName > 1) {
        setFontSizeName((prev) => prev - 1);
      }
    }
  }, [name, fontSizeName, normalizedCardType]);

  const getDate = new Date();
  const monthName = getDate.toLocaleString("default", { month: "long" });
  const getDayMonthYear =
    getDate.getDate() +
    " " +
    monthName.toUpperCase() +
    " " +
    getDate.getFullYear();

  return (
    <>
      <div className="container-card relative ">
        <div className="absolute inset-0 z-2 flex items-center rounded-2xl justify-center opacity-0 hover:opacity-100 transition-all delay-100 backdrop-blur-sm gap-2">
          {/* <Button
            className="btn border-none group bg-gray-800 hover:bg-gray-600"
            onClick={() => onHideCard(id, cardType)}
            variant="secondary"
          >
            <EyeOff
              color="white"
              className="group-hover:mb-2 delay-75 transition-all"
            />
          </Button> */}

          <Button
            className="btn border-none group"
            variant="destructive"
            onClick={() => onRemove()}
          >
            <Trash
              color="white"
              className="group-hover:mb-2 delay-75 transition-all"
            />
          </Button>
          {/* <Button
            className="btn bg-blue-600 border-none group"
            onClick={() => onEdit(index)}
          >
            <Edit
              color="white"
              className="group-hover:mb-2 delay-75 transition-all"
            />
          </Button> */}
        </div>
        {/* Delivery Card */}

        {normalizedCardType === "delivery" && (
          <main className="deliverycard relative font-cardFont2 w-[9cm] h-[6cm] text-black bg-white rounded-2xl">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-blue-500 h-[3cm] absolute top-[2cm] left-[0.5cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.23cm] left-[5.15cm] flex items-end"
              style={{ height: "20px" }} // Fixed height container
            >
              <p
                ref={nameRef}
                className="forName"
                style={{
                  fontSize: `${fontSizeName}px`,
                  lineHeight: `${fontSizeName + lineHight}px`, // prevents vertical jump
                }}
              >
                {name}
              </p>
            </div>
            <p className="forBlock absolute text-[18px] top-[3.26cm] left-[5.14cm]">
              {formattedBlock}
            </p>
            <p className="forID absolute text-[18px] top-[3.84cm] left-[5.14cm]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={deliverycard} alt="" />
            </div>
          </main>
        )}

        {/* TukTuk Card */}
        {normalizedCardType === "tuktuk" && (
          <main className="TukTukcard relative font-cardFont2 w-[9cm] h-[6cm] text-black bg-white rounded-2xl">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-blue-500 h-[3cm] absolute top-[2cm] left-[0.5cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.23cm] left-[5.15cm] flex items-end"
              style={{ height: "20px" }} // Fixed height container
            >
              <p
                ref={nameRef}
                className="forName"
                style={{
                  fontSize: `${fontSizeName}px`,
                  lineHeight: `${fontSizeName + lineHight}px`, // prevents vertical jump
                }}
              >
                {name}
              </p>
            </div>
            <p className="forBlock absolute text-[18px] top-[3.26cm] left-[5.14cm]">
              {formattedBlock}
            </p>
            <p className="forID absolute text-[18px] top-[3.80cm] left-[5.14cm]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={tuktuk} alt="" />
            </div>
          </main>
        )}

        {/* Staff Card */}
        {normalizedCardType === "staff" && (
          <main className="relative font-cardFont2 w-[9cm] h-[6cm] text-black  bg-white rounded-2xl">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-yellow-300 h-[3cm] absolute top-[2cm] left-[0.5cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.22cm] left-[5.23cm] flex items-end"
              style={{ height: "20px" }} // Fixed height container
            >
              <p
                ref={nameRef}
                className="forName"
                style={{
                  fontSize: `${fontSizeName}px`,
                  lineHeight: `${fontSizeName + lineHight}px`, // prevents vertical jump
                }}
              >
                {name}
              </p>
            </div>
            <p className="staffcard forBlock absolute text-[18px] top-[3.26cm] left-[5.21cm]">
              {formattedBlock}
            </p>
            <p className="forID absolute text-[18px] top-[3.79cm] left-[5.21cm]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={staffcard} alt="" />
            </div>
          </main>
        )}

        {/* Construction Card */}
        {normalizedCardType === "construction" && (
          <main className="relative font-cardFont2 w-[9cm] h-[6cm] text-black  bg-white rounded-2xl">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-yellow-300 h-[3cm] absolute top-[2cm] left-[0.3cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.30cm] left-[4.86cm] flex items-end"
              style={{ height: "20px" }} // Fixed height container
            >
              <p
                ref={nameRef}
                className="forName"
                style={{
                  fontSize: `${fontSizeName}px`,
                  lineHeight: `${fontSizeName + lineHight}px`, // prevents vertical jump
                }}
              >
                {name}
              </p>
            </div>
            <p className="staffcard forBlock absolute text-[16px] top-[3.30cm] left-[4.86cm]">
              {formattedBlock}
            </p>
            <p className="forID absolute text-[18px] top-[3.76cm] left-[4.87cm]">
              {id}
            </p>
            <p className="forDate absolute text-[16px] top-[4.33cm] left-[4.86cm]">
              {getDayMonthYear}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={construction} alt="" />
            </div>
          </main>
        )}

        {/* VIP Card */}
        {normalizedCardType === "vip card" && (
          <main className="vipcard relative font-cardFont2 w-[9cm] h-[6cm] text-black  bg-white rounded-2xl">
            <div
              className="absolute top-[2.20cm] left-[5.25cm] flex items-end"
              style={{ height: "20px" }} // Fixed height container
            >
              <p
                ref={nameRef}
                className="forName"
                style={{
                  fontSize: `${fontSizeName}px`,
                  lineHeight: `${fontSizeName + lineHight}px`, // prevents vertical jump
                }}
              >
                {name}
              </p>
            </div>

            <p className="staffcard forBlock absolute text-[18px] top-[3.21cm] left-[5.25cm]">
              {formattedBlock}
            </p>
            <p className="forID absolute text-[18px] top-[3.76cm] left-[5.25cm]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={vipcard} alt="" />
            </div>
          </main>
        )}

        {/* Car Card */}
        {normalizedCardType === "car card" && (
          <main className="carcard relative font-cardFont1 w-[9cm] h-[6cm] text-black  bg-white rounded-2xl">
            <div className="w-full h-[4cm] absolute top-[1.57cm] flex items-center justify-center text-center">
              <p
                ref={platRef}
                className="plat-number text-[#0d07fd] text-stroke-sm direction-rtl"
                style={{ fontSize: `${platFontSize}cm` }}
              >
                {name}
              </p>
            </div>

            <p className="staffcard forBlock absolute text-[7px] text-blue-400 top-[5.56cm] left-[7.15cm]">
              {formattedBlock}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={carcard1} alt="" />
            </div>
          </main>
        )}
      </div>
    </>
  );
}

export default CardPreview;
