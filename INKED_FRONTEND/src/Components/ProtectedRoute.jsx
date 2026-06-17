import { Navigate } from "react-router-dom"; {/*Navigate is React Router's redirect tool*/}

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; {/*If token exists, render the children components likeDashboard)*/}
}