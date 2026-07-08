import React from "react";
import Logo from "../../assets/images/logo.svg";
import Menu from "../../assets/images/Menu.svg";
import { useNavigate, useOutletContext } from "react-router-dom";


const NavbarLeft = () => {
  const { showNav, setShowNav } = useOutletContext();

  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-[30px] lg:hidden">
      <button onClick={() => setShowNav(!showNav)}>
        <img src={Menu} />
      </button>
      <button onClick={() => navigate("/dashboard")} >
        <img src={Logo} />
      </button>
    </div>
  );
};

export default NavbarLeft;
