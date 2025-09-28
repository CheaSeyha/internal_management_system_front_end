"use client";

import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth } from "../auth/AuthContext";
import axios from "../api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { set } from "zod";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState(() => {
    // Try localStorage first
    const savedUserLocal = localStorage.getItem("user");
    if (savedUserLocal) {
      const userData = JSON.parse(savedUserLocal);
      // Ensure full URL for avatar
      userData.avatar = userData.profile_image
        ? `http://127.0.0.1:8000${userData.profile_image}`
        : null;
      return userData;
    }

    // Fallback to sessionStorage
    const savedUserSession = sessionStorage.getItem("user");
    if (savedUserSession) {
      const userData = JSON.parse(savedUserSession);
      userData.avatar = userData.profile_image
        ? `http://127.0.0.1:8000${userData.profile_image}`
        : null;
      return userData;
    }

    return null;
  });

  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault(); // prevent dropdown close
    setLoading(true);
    try {
      await axios.post("/logout");
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Failed to log out");
    } finally {
      logout();
      setLoading(false);
      navigate("/auth/login", { replace: true });
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userInfo?.avatar}
                  alt={userInfo?.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userInfo?.name?.toUpperCase()}
                </span>
                <span className="truncate text-xs">{userInfo?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userInfo?.avatar}
                    alt={userInfo?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userInfo?.name?.toUpperCase()}
                  </span>
                  <span className="truncate text-xs">{userInfo?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Logout menu item without NavLink */}
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loading} // disable button when loading
              className="cursor-pointer flex items-center gap-2"
            >
              <LogOut
                className={`transition-opacity ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
              />
              {loading ? (
                <>
                  Please Wait...
                  <span className="loading loading-spinner loading-md"></span>
                </>
              ) : (
                "Log out"
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
