import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./layout";
import { ThemeProvider } from "./components/theme-provider";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./framerComponent/AnimatedPage";
import CardGenerator from "./pages/CardGenerator/CardGenerator";
import AllCards from "./pages/CardGenerator/AllCards";
import Login from "./pages/Auth/Login";
import { Toaster } from "@/components/ui/sonner";
function App() {
  const location = useLocation(); // Get the current location

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="auth">
            <Route path="login" element={<Login />} />
          </Route>

          <Route path="/" element={<Layout />}>
            <Route path="cards">
              <Route
                path="card-generator"
                element={
                  <AnimatedPage>
                    <CardGenerator />
                  </AnimatedPage>
                }
              />
              <Route
                path="all-cards"
                element={
                  <AnimatedPage>
                    <AllCards />
                  </AnimatedPage>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
