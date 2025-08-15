import * as React from "react";
import {
  GalleryVerticalEnd,
  IdCard,
  HouseWifi,
  CalendarDays,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {data} from '../data/sidebar_data';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
// const data = {
//   user: {
//     name: "RONAL PLAOK",
//     email: "plaokNalDo235@plaok.com",
//     avatar:
//       "https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-during-the-uefa-nations-news-photo-1748359673.pjpeg?crop=0.610xw:0.917xh;0.317xw,0.0829xh&resize=640:*",
//   },
//   teams: [
//     {
//       name: "System",
//       logo: GalleryVerticalEnd,
//       plan: "Test System",
//     },
//   ],
//   navMain: [
//     {
//       title: "Roster",
//       url: "", // main path
//       icon: CalendarDays,
//     },
//     {
//       title: "Card Access",
//       url: "cards", // main path
//       icon: IdCard,
//       isActive: false,
//       items: [
//         {
//           title: "All Cards",
//           url: "all-cards", // ✅ full path
//         },
//         {
//           title: "Generate Card",
//           url: "card-generator", // ✅ full path
//         },
//       ],
//     },
//     {
//       title: "Internet",
//       url: "internet", // main path
//       icon: HouseWifi,
//       isActive: false,
//       items: [
//         {
//           title: "All Customers",
//           url: "all-customers", // ✅ full path
//         },
//         {
//           title: "All ISP",
//           url: "all-isp", // ✅ full path
//         },
//       ],
//     },
//   ],
// };

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
