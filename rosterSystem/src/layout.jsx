import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { WalletCards } from "lucide-react"; // keep as fallback
import { getSidebarData } from "./data/sidebar_data";

const data = getSidebarData();

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, ""); // remove leading "/"

  let parentTitle = null;
  let childTitle = null;
  let CurrentIcon = WalletCards; // default fallback icon

  for (const parent of data.navMain) {
    const parentUrl = parent.url || "";

    if (
      (parentUrl === "" && currentPath === "") ||
      (parentUrl && currentPath.startsWith(parentUrl))
    ) {
      parentTitle = parent.title;
      CurrentIcon = parent.icon || WalletCards; // 👈 assign parent icon

      if (parent.items && parent.items.length > 0) {
        const child = parent.items.find((sub) => currentPath.endsWith(sub.url));
        if (child) {
          childTitle = child.title;
        }
      }
      break;
    }
  }

  const pageTitle = parentTitle
    ? childTitle
      ? `${parentTitle} \\ ${childTitle}`
      : parentTitle
    : "Unknown Page";

  // 👇 Dynamically update <title>
  useEffect(() => {
    const team = data.teams?.[0];
    const baseTitle = team ? `${team.name} ${team.plan}` : "My App";

    document.title =
      pageTitle !== "Unknown Page" ? `${pageTitle} | ${baseTitle}` : baseTitle;
  }, [pageTitle]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-background p-5 overflow-auto">
        <div className="flex justify-center place-items-center mb-5 gap-2">
          <SidebarTrigger />
          <DarkModeToggle />
          {/* Title with Dynamic Icon */}
          <nav className="w-full flex items-center gap-2">
            <CurrentIcon className="text-blue-700 text-2xl" />
            <h1 className="text-lg font-bold">{pageTitle}</h1>
          </nav>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
