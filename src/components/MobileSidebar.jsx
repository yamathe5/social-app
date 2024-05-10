import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./MobileSidebar.css";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleSidebar} className="hamburger-button">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <button onClick={toggleSidebar} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
};

export default MobileSidebar;
