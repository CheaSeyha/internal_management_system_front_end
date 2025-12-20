import React, { useEffect, useRef, useState } from "react";
import vipcard from "../../../assets/CardTamplete/VIP 2026.png";
import staffcard from "../../../assets/CardTamplete/Staff 2026.png";
import ispCard from "../../../assets/CardTamplete/ISP 2026.png";
import rolling from "../../../assets/CardTamplete/ROLLING 2026.png";
import deliverycard from "../../../assets/CardTamplete/Delivery 2026.png";
import tuktuk from "../../../assets/CardTamplete/TUKTUK.png";
import carcard1 from "../../../assets/CardTamplete/Card Car 2026.png";
import construction from "../../../assets/CardTamplete/CONSTRUCTION.png";
import { Trash, Edit, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
function CardPreview2026({
  name,
  block,
  id,
  image,
  cardType,
  onRemove,
  onEdit,
  onHideCard,
  index,
  isp_name,
  isp_position,
  rolling_link,
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
  const ispNameRef = useRef();
  const ispPosRef = useRef();

  const [ispScaleX, setIspScaleX] = useState(1);
  const [lineHight, setLineHight] = useState(0);

  // Name font scaling for TukTuk and Construction
  useEffect(() => {
    let currentFontSize = 18;
    if (normalizedCardType === "construction") currentFontSize = 16;
    if (normalizedCardType === "delivery" || normalizedCardType === "tuktuk")
      currentFontSize = 17;

    if (name.length >= 20) setLineHight(2);
    else setLineHight(0);

    if (nameRef.current) {
      nameRef.current.style.fontSize = `${currentFontSize}px`;
      const maxWidth = 134;
      let width = nameRef.current.getBoundingClientRect().width;
      while (width > maxWidth && currentFontSize > 1) {
        currentFontSize -= 0.05;
        nameRef.current.style.fontSize = `${currentFontSize}px`;
        width = nameRef.current.getBoundingClientRect().width;
      }
      setFontSizeName(currentFontSize);
    }
  }, [name, normalizedCardType]);

  // ISP Font Stretching Logic
  useEffect(() => {
    if (normalizedCardType === "isp" && ispNameRef.current && ispPosRef.current) {
      // Reset scale to 1 to measure natural width
      ispNameRef.current.style.transform = "scaleX(1)";
      ispPosRef.current.style.transform = "scaleX(1)";

      const gap = 8; // Safety gap between name and position
      const maxWidth = 126; // Total available width (6cm card container logic)

      const naturalWidthA = ispNameRef.current.getBoundingClientRect().width;
      const naturalWidthB = ispPosRef.current.getBoundingClientRect().width;
      const totalNaturalWidth = naturalWidthA + naturalWidthB + gap;

      if (totalNaturalWidth > maxWidth) {
        // Calculate how much we need to squash the name to fit
        // Available width for name = maxWidth - (position width + gap)
        const availableForName = maxWidth - naturalWidthB - gap;
        const scale = availableForName / naturalWidthA;
        setIspScaleX(Math.max(scale, 0.4)); // Don't squash more than 40%
      } else {
        setIspScaleX(1);
      }
    }
  }, [isp_name, isp_position, normalizedCardType]);

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
        <div className="absolute inset-0 z-2 flex items-center justify-center opacity-0 hover:opacity-100 transition-all delay-100 backdrop-blur-sm gap-2 rounded-2xl">
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
            onClick={() => onRemove(name)}
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
          <main className="relative w-[6cm] h-[9cm]">
            <div className="image-profile absolute top-[90px] left-[40px] w-[3.96cm] h-[3.96cm] border-1 border-[#d9fa00] rounded-full overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            {/* block  */}

            <p className=" absolute top-[291px] left-[40px] name-staff font-bold text-[9pt] font-californian-font text-black">
              {id}
            </p>
            <p className=" absolute top-[275px] left-[66px] name-staff font-bold text-[9pt] font-californian-font text-black">
              {formattedBlock}
            </p>
            {/* name  */}
            <div className="absolute w-full top-[243px] text-center">
              <p className="name-staff font-bold text-[10pt] font-californian-font text-black">
                NAME : {name}
              </p>
            </div>

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
          <main className="relative w-[6cm] h-[9cm]">
            <div className="image-profile absolute top-[90px] left-[40px] w-[3.96cm] h-[3.96cm] border-1 border-[#ff006f] rounded-full overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            {/* block  */}

            <p className=" absolute top-[291px] left-[40px] name-staff font-bold text-[9pt] font-californian-font text-black">
              {id}
            </p>
            <p className=" absolute top-[275px] left-[66px] name-staff font-bold text-[9pt] font-californian-font text-black">
              {formattedBlock}
            </p>
            {/* name  */}
            <div className="absolute w-full top-[243px] text-center">
              <p className="name-staff font-bold text-[10pt] font-californian-font text-black">
                NAME : {name}
              </p>
            </div>

            <div className="image-tamplete w-full h-full">
              <img src={staffcard} alt="" />
            </div>
          </main>
        )}

        {/* ISP Card */}
        {normalizedCardType === "isp" && (
          <main className="relative w-[6cm] h-[9cm]">
            <div className="image-profile absolute top-[90px] left-[40px] w-[3.96cm] h-[3.96cm] border-1 border-[#ff006f] rounded-full overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            {/* block  */}

            <p className=" absolute top-[291px] left-[40px] name-staff font-bold text-[9pt] font-californian-font text-black">
              {id}
            </p>
            {/* ISP name  */}
            <p
              ref={ispNameRef}
              className="absolute top-[274.50px] left-[82px] name-staff font-bold text-[9pt] font-californian-font text-black whitespace-nowrap inline-block"
              style={{
                transform: `scaleX(${ispScaleX})`,
                transformOrigin: "left",
              }}
            >
              {isp_name}
            </p>
            {/* ISP position  */}
            {isp_position && (
              <p
                ref={ispPosRef}
                className="absolute top-[274.50px] right-[18px] text-right name-staff font-bold text-[9pt] font-californian-font text-black"
              >
                {isp_position}
              </p>
            )}
            {/* name  */}
            <div className="absolute w-full top-[243px] text-center">
              <p className="name-staff font-bold text-[10pt] font-californian-font text-black">
                NAME : {name}
              </p>
            </div>

            <div className="image-tamplete w-full h-full">
              <img src={ispCard} alt="" />
            </div>
          </main>
        )}

        {/* ISP rolling */}
        {normalizedCardType === "rolling" && (
          <main className="relative w-[6cm] h-[9cm]">
            <div className="image-profile absolute top-[90px] left-[40px] opca w-[3.96cm] h-[3.96cm] border-1 border-[#ff006f] rounded-full overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            {/* block  */}

            <p className=" absolute top-[291px] left-[40px] name-staff font-bold text-[9pt] font-californian-font text-white">
              {id}
            </p>
            {/* ISP name or Link  */}
            <p className=" absolute top-[275px] left-[56px] name-staff font-bold text-[9pt] font-californian-font text-white">
              {rolling_link}
            </p>

            {/* name  */}
            <div className="absolute w-full top-[243px] text-center">
              <p className="name-staff font-bold text-[10pt] font-californian-font text-white">
                NAME : {name}
              </p>
            </div>

            <div className="image-tamplete w-full h-full">
              <img src={rolling} alt="" />
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
          <main className="vipcard relative w-[9cm] h-[6cm] text-black  bg-white rounded-br-[20px] rounded-tl-[20px]">
            <p className="staffcard forBlock absolute text-[12pt] font-luxury-display top-[146px] left-[99px]">
              {name}
            </p>

            <p className="staffcard forBlock absolute text-[9pt] font-luxury-display top-[168.5px] left-[86px]">
              {formattedBlock}
            </p>
            <p className="forID absolute text-[9pt] font-luxury-display top-[185px] left-[59px]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={vipcard} alt="" />
            </div>
          </main>
        )}

        {/* Car Card */}
        {normalizedCardType === "car card" && (
          <main className="carcard relative font-cardFont1 w-[20cm] h-[13.34cm] text-black  bg-white rounded-4xl">
            <div className="w-full h-[4cm] absolute top-[6.2cm] flex items-center justify-center text-center">
              <p

                className="plat-number text-[80pt] text-[#dcfd07]"
                style={{
                  WebkitTextStroke: "2px #000000",
                }}
              >
                {name}
              </p>
            </div>
            <div className="w-full absolute top-[11.7cm] flex items-center justify-center text-center">
              <p className="plat-number text-[20pt] text-[#0030ff]">
                BLOCK : {formattedBlock}
              </p>
            </div>
            <div className="image-tamplete w-full h-full">
              <img src={carcard1} alt="" />
            </div>
          </main>
        )}
      </div>
    </>
  );
}

export default CardPreview2026;
