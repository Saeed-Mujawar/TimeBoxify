import React from "react";
import "./Navbar.css";

const Navbar = ({isConnected, onDisconnect }) => {
  return (
    <nav className="navbar">
      <h1>Weekly Timeboxing & Prioritization</h1>
      {isConnected && (
      <button className="disconnect-btn" onClick={onDisconnect}>Disconnect With Google</button>
      )}
    </nav>
  );
};

export default Navbar;
