import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout }= useAuth();

  const handleLogout = () => {
    
    logout();
    // Redirect to login or home page
    navigate("/");
  };

  return (
    <button
      className="bg-cyan-400"
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        // backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Log out
    </button>
  );
}
