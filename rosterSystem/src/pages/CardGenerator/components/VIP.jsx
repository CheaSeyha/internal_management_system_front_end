import React, { useEffect, useRef, useState } from "react";
import vipcard from "../../../assets/CardTamplete/VIP.png";
import staffcard from "../../../assets/CardTamplete/STAFF.png";
import deliverycard from "../../../assets/CardTamplete/DELIVERY.png";
import tuktuk from "../../../assets/CardTamplete/TUKTUK.png";
import carcard1 from "../../../assets/CardTamplete/CAR1.png";
import { Trash,Edit  } from "lucide-react";
function VIP({ name, block, id, image, cardType, onRemove, onEdit, index }) {
  const [fontSizeName, setFontSizeName] = useState(16); // Starting font size
  const nameRef = useRef();
  const [lineHight, setLineHight] = useState(0);
  useEffect(() => {
    if (name.length >= 20) {
      setLineHight(2);
      console.log(lineHight);
    } else {
      setLineHight(0);
    }
    if (nameRef.current) {
      const width = nameRef.current.getBoundingClientRect().width;
      console.log("Name width:", width, "px");

      if (width > 134 && fontSizeName > 1) {
        // Reduce font size one step at a time
        setFontSizeName((prev) => prev - 1);
      }
    }
  }, [name, fontSizeName]); // Watch both name and fontSizeName

  return (
    <>
      <div className="container-card relative ">
        <div className="absolute inset-0 z-2 flex items-center rounded-2xl justify-center opacity-0 hover:opacity-100 transition-all delay-100 backdrop-blur-sm gap-2">
          <button
            className="btn bg-red-500 border-none group"
            onClick={() => onRemove(name)}
          >
            <Trash  color="white" className="group-hover:mb-2 delay-75 transition-all" />
          </button>
          <button
            className="btn bg-blue-500 border-none group"
            onClick={() => onEdit(index)}
          >
            <Edit color="white" className="group-hover:mb-2 delay-75 transition-all"/>
          </button>
        </div>
        {/* Delivery Card */}
        {cardType === "Delivery" && (
          <main className="deliverycard relative font-cardFont2 w-[9cm] h-[6cm] text-black">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-blue-500 h-[3cm] absolute top-[2cm] left-[0.5cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.21cm] left-[5.15cm] flex items-end"
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
              {block}
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
        {cardType === "TukTuk" && (
          <main className="deliverycard relative font-cardFont2 w-[9cm] h-[6cm] text-black">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-blue-500 h-[3cm] absolute top-[2cm] left-[0.5cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.21cm] left-[5.15cm] flex items-end"
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
              {block}
            </p>
            <p className="forID absolute text-[18px] top-[3.84cm] left-[5.14cm]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={tuktuk} alt="" />
            </div>
          </main>
        )}

        {/* Staff Card */}
        {cardType === "Staff" && (
          <main className="relative font-cardFont2 w-[9cm] h-[6cm] text-black">
            <div className="image-profile w-[2.5cm] border-[1.5px] border-yellow-300 h-[3cm] absolute top-[2cm] left-[0.5cm]">
              <img src={image} className="w-full h-full object-cover" alt="" />
            </div>
            <div
              className="absolute top-[2.19cm] left-[5.23cm] flex items-end"
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
              {block}
            </p>
            <p className="forID absolute text-[18px] top-[3.79cm] left-[5.21cm]">
              {id}
            </p>
            <div className="image-tamplete w-full h-full">
              <img src={staffcard} alt="" />
            </div>
          </main>
        )}

        {/* VIP Card */}
        {cardType === "VIP Card" && (
          <main className="vipcard relative font-cardFont2 w-[9cm] h-[6cm] text-black">
            <div
              className="absolute top-[2.16cm] left-[5.25cm] flex items-end"
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
              {block}
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
        {cardType === "Car Card" && (
          <main className="carcard relative font-cardFont1 w-[20cm] h-[13.34cm] text-black">
            <p className="plat-number absolute text-[2.9cm] text-[#0d07fd] top-[6.57cm] left-[4.79cm] text-stroke text-right direction-rtl">
              {name}
            </p>

            <p className="staffcard forBlock absolute text-[13px] text-blue-400 top-[12.46cm] left-[15.25cm]">
              {block}
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
