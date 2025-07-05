import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
   useEffect(() => {
      if (user) {
        console.log("role:", user);
      }
    }, [user]);
    
  // console.log(user.email);
  
    
    
  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
}
