// layout.jsx
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Outlet } from "react-router-dom";
import { DarkModeToggle } from "./components/DarkModeToggle";
export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-background">
        <SidebarTrigger/>
        <DarkModeToggle/>
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </SidebarProvider>
  );
}
