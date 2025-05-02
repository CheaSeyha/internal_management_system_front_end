import React, { useState } from "react";
import Navbar from "./components/Navbar";
import RosterForm from "./pages/RosterForm/RosterForm";
import CardGenerator from "./pages/CardGenerator/CardGenerator";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
function App() {

  const [isOpenSidebar,setOpenSideBar] = useState(false);

  const openSidebar = () => {
    setOpenSideBar(!isOpenSidebar);
  };

  return (
    <>
      <main className="relative">
        <Navbar 
          openSideBar={openSidebar}
        />
        <Sidebar isOpenSidebar={isOpenSidebar}/>
        {/* <RosterForm/> */}
        <Routes>
          <Route path="/" element={<RosterForm />} />
          <Route path="/CardGenerator" element={<CardGenerator />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
