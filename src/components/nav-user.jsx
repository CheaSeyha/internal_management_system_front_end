"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";

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

export function NavUser({ user: userProp }) {
  const { isMobile } = useSidebar();
  const { logout, user } = useAuth();
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  const downloadImageProfile = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get("/user/image/" + user.id, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setUserInfo((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      // Cleanup function to avoid memory leaks
      return () => URL.revokeObjectURL(imageUrl);
    } catch (err) {
      console.error("Failed to fetch user image:", err);
    }
  };

  useEffect(() => {
    let cleanup;
    downloadImageProfile().then((cb) => (cleanup = cb));

    return () => {
      if (cleanup) cleanup();
    };
  }, [user?.id]);

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
