import { Link } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="NavBar">
      <div className="logo">Moonlight Café</div>
      
     
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
};

export default NavBar;
