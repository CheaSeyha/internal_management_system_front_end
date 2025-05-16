import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Settings,
  Folder,
  Calendar,
  FileText,
  Plus,
  UserCog,
  FileSearch,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpenSidebar, openSideBar }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
    projects: false,
    settings: false,
  });

  const handleSummaryClick = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const location = useLocation();

  // Animation variants for the sidebar
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    closed: {
      x: -256,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        delay: 0.15, // Slight delay when closing
      },
    },
  };

  // Animation variants for menu items
  const menuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };


  const subMenuItemVariants = {
    open: {
      opacity: 1,
      y: 10,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="bg-base-200 text-base-content absolute z-50 w-64 h-screen shadow-2xs"
      initial="closed"
      animate={isOpenSidebar ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <motion.ul className="menu p-4 w-full">
        <motion.li variants={menuItemVariants} className="w-[100%]">
          <Link
            onClick={openSideBar}
            to="/"
            className={`active ${
              location.pathname === "/" ? "bg-sidebarActive" : ""
            }`}
          >
            <Home size={18} />
            Roster Form
          </Link>
        </motion.li>

        <motion.li variants={menuItemVariants}>
          <Link
            onClick={openSideBar}
            to="/CardGenerator"
            className={`active ${
              location.pathname === "/CardGenerator" ? "bg-sidebarActive" : ""
            }`}
          >
            <FileText size={18} />
            Card Generator
          </Link>
        </motion.li>

        <motion.li variants={menuItemVariants}>
          <details>
            <summary onClick={() => handleSummaryClick("settings")}>
              <Settings size={18} />
              Settings
            </summary>
            <ul className="transition-all delay-75">
              <li>
                <a>Account Settings</a>
              </li>
              <li>
                <a>Privacy</a>
              </li>
              <li>
                <a>Notifications</a>
              </li>
            </ul>
          </details>
        </motion.li>
      </motion.ul>
    </motion.div>
  );
};

export default Sidebar;
