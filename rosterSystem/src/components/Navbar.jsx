import React from "react";
import { User, Menu } from "lucide-react";
import ThemeToggle from "./buttons/ThemeToggle";
function Navbar({openSideBar}) {
  return (
    <nav className="bg-[#106D6D] h-[55px]">
      <div className="logo-company-name h-full flex items-center justify-between text-white px-5 py-2">
        <div className="side-logo flex items-center gap-5">
          <button onClick={openSideBar} className="bg-[#106D6D] transition-all tra cursor-pointer p-2 active:scale-90">
            <Menu size={24} />
          </button>
          <p className="font-bold">TEST</p>
        </div>
        <section className="user-profile flex w-fit h-full items-center gap-5">
          <ThemeToggle />
          <p className="hidden md:block">PLEAOK MEAS - IT</p>
          <div className="profile h-[40px] bg-fuchsia-600 w-[40px] rounded-full flex justify-center items-center overflow-hidden">
            <img
              src={
                "https://img.freepik.com/free-photo/business-finance-employment-female-successful-entrepreneurs-concept-smiling-professional-female-office-manager-ceo-e-commerce-company-looking-pleased-camera-white-background_1258-59171.jpg?t=st=1744639957~exp=1744643557~hmac=28edbad0a87d7b14c88b390e57206c905224af1996a29adb0d32a29f500e166e&w=996"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </div>
    </nav>
  );
}

export default Navbar;
