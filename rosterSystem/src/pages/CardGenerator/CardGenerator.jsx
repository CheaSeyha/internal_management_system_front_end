import React from "react";
import nwc_logo from "../../assets/logo/nwc logo.png";
import staffcard from "../../assets/image/STAFF.png";
function CardGenerator() {
  return (
    <>
      <div>CardGenerator</div>

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
              <div className="image-card w-[85px] h-[100px] border border-blue-500 ml-3 mt-5">
                <img
                  src="https://img.freepik.com/free-photo/portrait-successful-businesswoman-suit-smiling-looking-like-professional-camera-white-background_1258-89425.jpg?t=st=1745976893~exp=1745980493~hmac=cce27ca5d08cdff03cdf133ac2a5809184a6b4d0eaa9bf970775754b04d68085&w=996"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div class="infor pt-5">
                <p class="leading-tight">Name : Plaok Meas</p>
                <p class="leading-tight">Position : Dj</p>
                <p class="leading-tight">Block : N</p>
                <p class="leading-tight">ID No: 00001</p>
                <p class="leading-tight">Date Expire : Dec 31,2025</p>
              </div>
            </div>
            {/* Address  */}
            <div className="container-address flex justify-center items-center h-[40px]">
              <div className="address-infor bg-[#0b2754] absolute text-[9px] px-1 rounded-[3px] ransform scale-x-105 font-bold">
                <p className="">
                  National Road 1, Bavet Commune, Bavet City, Svay Rieng
                  Province
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="staff_card absolute opacity-50 ">
          {/* <img src={staffcard} className="z-50" alt="" /> */}
        </div>
      </div>
    </>
  );
}

export default CardGenerator;