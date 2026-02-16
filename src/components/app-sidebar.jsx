import * as React from "react";
import { useAuth } from "../auth/AuthContext";

import { getSidebarData } from "../data/sidebar_data";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar(props) {
  const { user } = useAuth();
  const data = getSidebarData(user);

  // ✅ FILTER BY ROLE
  const filteredNavMain = data.navMain.filter((item) => {
    if (!item.roles) return true; // public menu
    return item.roles.includes(user?.role_id);
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
