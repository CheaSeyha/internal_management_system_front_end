import React, { useState } from "react";
import Navbar from "./components/Navbar";
import RosterForm from "./pages/RosterForm/RosterForm";
import CardGenerator from "./pages/CardGenerator/CardGenerator";
import { Routes, Route, useLocation } from "react-router-dom"; // Add useLocation import
import Sidebar from "./components/Sidebar";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./framerComponent/AnimatedPage";

function App() {
  const [isOpenSidebar, setOpenSideBar] = useState(false);
  const location = useLocation(); // Add this line

  const openSidebar = () => {
    setOpenSideBar(!isOpenSidebar);
  };

  return (
    <>
      <main className="relative">
        <Navbar openSideBar={openSidebar} />
        <Sidebar isOpenSidebar={isOpenSidebar} openSideBar={openSidebar}/>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <RosterForm />
                </AnimatedPage>
              }
            />
            <Route
              path="/CardGenerator"
              element={
                <AnimatedPage>
                  <CardGenerator />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;