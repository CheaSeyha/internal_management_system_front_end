import React, { useEffect, useRef, useState } from "react";
import vipcard from "../../../assets/CardTamplete/VIP.png";
import staffcard from "../../../assets/CardTamplete/STAFF.png";
import deliverycard from "../../../assets/CardTamplete/DELIVERY.png";
import tuktuk from "../../../assets/CardTamplete/TUKTUK.png";
import carcard1 from "../../../assets/CardTamplete/CAR1.png";
import construction from "../../../assets/CardTamplete/CONSTRUCTION.png";
import { Trash, Edit } from "lucide-react";
function VIP({ name, block, id, image, cardType, onRemove, onEdit, index }) {
  const normalizedCardType = cardType?.toLowerCase() || "";

  function formatBlocks(block) {
    if (!Array.isArray(block) || block.length === 0) return "";

    // Check if any block has a room (contains a dash followed by digits)
    const hasRoom = block.some((item) => /-\d+/.test(item));

    if (hasRoom) {
      // If at least one block has a room, join with comma
      return block.join(", ");
    } else {
      // If no block has a room, concatenate directly
      return block.join("");
    }
  }

  const formattedBlock = formatBlocks(block); // ✅ call the function

  const [fontSizeName, setFontSizeName] = useState(18);
  const nameRef = useRef();
  const [lineHight, setLineHight] = useState(0);

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
          <button
            className="btn bg-red-500 border-none group"
            onClick={() => onRemove(name)}
          >
            <Trash
              color="white"
              className="group-hover:mb-2 delay-75 transition-all"
            />
          </button>
          <button
            className="btn bg-blue-500 border-none group"
            onClick={() => onEdit(index)}
          >
            <Edit
              color="white"
              className="group-hover:mb-2 delay-75 transition-all"
            />
          </button>
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
          <main className="carcard relative font-cardFont1 w-[20cm] h-[13.34cm] text-black  bg-white rounded-2xl">
            <div className="w-full h-[4cm] absolute top-[6.57cm] flex items-center justify-center text-center">
              <p className="plat-number text-[2.9cm] text-[#0d07fd] text-stroke direction-rtl">
                {name}
              </p>
            </div>

            <p className="staffcard forBlock absolute text-[13px] text-blue-400 top-[12.46cm] left-[15.25cm]">
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

export default VIP;
