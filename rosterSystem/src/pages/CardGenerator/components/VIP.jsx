import React from "react";
import vipcard from "../../../assets/CardTamplete/VIP.png";
import staffcard from "../../../assets/CardTamplete/STAFF.png";
import deliverycard from "../../../assets/CardTamplete/DELIVERY.png";
import carcard from "../../../assets/CardTamplete/CAR.png";
import carcard1 from "../../../assets/CardTamplete/CAR1.png";

function VIP({ name, block, id, image, cardType }) {
  return (
    <>
      {/* Delivery Card */}
      {cardType === "Delivery" && (
        <main className="deliverycard relative font-cardFont2 w-[9cm] h-[6cm] text-black bg-white">
          <div className="image-profile w-[2.5cm] border-[1.5px] border-blue-500 h-[3cm] absolute top-[2cm] left-[0.5cm]">
            <img src={image} className="w-full h-full object-cover" alt="" />
          </div>
          <p className="forName absolute text-[18px] top-[2.16cm] left-[5.14cm] uppercase">
            {name}
          </p>
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

      {/* Staff Card */}
      {cardType === "Staff" && (
        <main className="relative font-cardFont2 w-[9cm] h-[6cm] text-black bg-white">
          <div className="image-profile w-[2.5cm] border-[1.5px] border-yellow-300 h-[3cm] absolute top-[2cm] left-[0.5cm]">
            <img src={image} className="w-full h-full object-cover" alt="" />
          </div>
          <p className="forName absolute text-[18px] top-[2.14cm] left-[5.21cm]">
            {name}
          </p>
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
        <main className="vipcard relative font-cardFont2 w-[9cm] h-[6cm] text-black bg-white">
          <p className="forName absolute text-[18px] top-[2.11cm] left-[5.25cm]">
            {name}
          </p>
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
        <main className="carcard relative font-cardFont1 w-[20cm] h-[13.34cm] text-black bg-white">
          <p className="plat-number uppercase absolute text-[2.9cm] text-[#0d07fd] top-[6.57cm] left-[4.79cm] text-stroke">
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
    </>
  );
}

export default VIP;