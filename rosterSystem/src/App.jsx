import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import Layout from "./layout";
import { ThemeProvider } from "./components/theme-provider";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./framerComponent/AnimatedPage";
import CardGenerator from "./pages/CardGenerator/CardGenerator";
import AllCards from "./pages/CardGenerator/AllCards";
import Login from "./pages/Auth/Login";
import { Toaster } from "@/components/ui/sonner";
import AllCustomer from "./pages/Internet/AllCustomer";
import AllISP from "./pages/Internet/AllISP";
import RosterForm from "./pages/RosterForm/RosterForm";
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import BuildingRoom from "./pages/Blocks/BuildingRoom";
import CardSummary from "./pages/CardGenerator/CardSummary";
import UserPage from "./pages/UserManage/UserPage";
function App() {
  const location = useLocation(); // Get the current location

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="auth">
            <Route path="login" element={<Login />} />
          </Route>
          {/* Block Route  */}

          {/* Card Route  */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <RosterForm />
                </AnimatedPage>
              }
            />
            {/* Card Access Route  */}
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
              <Route
                path="cards-summary"
                element={
                  <AnimatedPage>
                    <CardSummary />
                  </AnimatedPage>
                }
              />
            </Route>
            {/* Internet Route  */}
            <Route path="internet">
              <Route
                path="all-customers"
                element={
                  <AnimatedPage>
                    <AllCustomer />
                  </AnimatedPage>
                }
              />
              <Route
                path="all-isp"
                element={
                  <AnimatedPage>
                    <AllISP />
                  </AnimatedPage>
                }
              />
            </Route>
            <Route path="internet">
              <Route
                path="all-customers"
                element={
                  <AnimatedPage>
                    <AllCustomer />
                  </AnimatedPage>
                }
              />
              <Route
                path="all-isp"
                element={
                  <AnimatedPage>
                    <AllISP />
                  </AnimatedPage>
                }
              />
            </Route>
            <Route
              path="user-manage"
              element={
                <ProtectedRoute allowedRoles={[1, 2]}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route
                path="all-users"
                element={
                  <AnimatedPage>
                    <UserPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="all-isp"
                element={
                  <AnimatedPage>
                    <AllISP />
                  </AnimatedPage>
                }
              />
            </Route>
            {/* Rote Building Room */}
            <Route
              path="buildings-rooms-manage"
              element={
                <AnimatedPage>
                  <BuildingRoom />
                </AnimatedPage>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
