import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdmin() {
  const isAuth = localStorage.getItem("adminAuth");

  if (!isAuth) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}
