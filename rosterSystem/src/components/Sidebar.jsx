import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  FileSearch
} from 'lucide-react';

const Sidebar = ({ isOpenSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
    projects: false,
    settings: false
  });

  const handleSummaryClick = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div className={`bg-base-200 text-base-content absolute z-50 transition-all delay-100 ${isOpenSidebar ? "translate-x-0" : "translate-x-[-256px]"} w-64 h-screen`}>
      <ul className="menu p-4 w-full">
        <li className='w-[100%]'>
          <Link to="/" className="active">
            <Home size={18} />
            Roster Form
          </Link>
        </li>

        <li>
          <Link to="/CardGenerator">
            <FileText size={18} />
            Card Generator
          </Link>
        </li>

        <li>
          <details>
            <summary onClick={() => handleSummaryClick('users')}>
              <Users size={18} />
              Users
            </summary>
            <ul>
              <li><a><Plus size={16} /> Add User</a></li>
              <li><a><UserCog size={16} /> Manage Users</a></li>
            </ul>
          </details>
        </li>

        <li>
          <a>
            <Calendar size={18} />
            Calendar
          </a>
        </li>

        <li>
          <details>
            <summary onClick={() => handleSummaryClick('settings')}>
              <Settings size={18} />
              Settings
            </summary>
            <ul className='transition-all delay-75'>
              <li><a>Account Settings</a></li>
              <li><a>Privacy</a></li>
              <li><a>Notifications</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
