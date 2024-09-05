import React from "react";
import "./SideBar.scss";
import logo from "../../Asset/Logo.mp4";
import { useNavigate } from "react-router-dom";


const SideBar = () => {

  const navigate = useNavigate();

  const handleClick = () => {
        navigate('/log');
  }
  return (
    <div id="sidebar">
      <div id="logo">
        <video src={logo} autoPlay muted loop>
        </video>
      </div>
      
      {/* CONTENT FOR ROUTING */}
      <div id="content">
        <div id="audit">
          <i class="fas fa-clipboard-list audit-icon"></i>
          <p onClick={handleClick}>Audit Log</p>
        </div>
      </div>

      {/* COPY-WRITE */}
      <div id="rights">
        <p> &copy;Novum Global Ventures 2024</p>
        <p>All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default SideBar;
