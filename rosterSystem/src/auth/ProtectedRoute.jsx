import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading/>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
