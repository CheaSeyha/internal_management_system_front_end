// layout.jsx
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Outlet } from "react-router-dom";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { WalletCards } from "lucide-react";
export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-background p-5">
        <div className="flex justify-center place-items-center mb-5 gap-2">
          <SidebarTrigger />
          <DarkModeToggle />
          {/* Tittle  */}
          <nav className="w-full flex items-center gap-2">
            <WalletCards className="text-blue-700 text-2xl" />
            <h1 className="text-lg font-bold">All Access Cards</h1>
          </nav>
        </div>
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </SidebarProvider>
  );
}
