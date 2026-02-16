import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/LoadingSpinner";
import NotFoundPage from "../pages/NotFoundPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role_id)) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background w-screen h-screen overflow-hidden">
        <NotFoundPage />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
