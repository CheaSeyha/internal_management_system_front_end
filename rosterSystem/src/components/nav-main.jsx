"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

export function NavMain({ items }) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Demo</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;

          // Check if any sub-item matches current path
          const shouldOpen =
            hasSubItems &&
            item.items.some(
              (subItem) => location.pathname === `/${item.url}/${subItem.url}`
            );

          if (hasSubItems) {
            // Parent highlight if any child is active
            const isParentActive = item.items.some(
              (subItem) => location.pathname === `/${item.url}/${subItem.url}`
            );

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={shouldOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && (
                        <item.icon
                          className={isParentActive ? "text-blue-500" : ""}
                        />
                      )}
                      <span
                        className={
                          isParentActive ? "text-blue-500 font-medium" : ""
                        }
                      >
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={`/${item.url}/${subItem.url}`}>
                              <span
                                className={
                                  location.pathname ===
                                  `/${item.url}/${subItem.url}`
                                    ? "text-blue-500 font-medium"
                                    : ""
                                }
                              >
                                {subItem.title}
                              </span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            // Top-level item without sub-items
            const isActive = location.pathname === `/${item.url}`;
            const highlightClass = isActive ? "text-blue-500 font-medium" : "";

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <NavLink
                    to={`/${item.url}`}
                    className="flex items-center w-full gap-2"
                  >
                    {item.icon && <item.icon className={highlightClass} />}
                    <span className={highlightClass}>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
