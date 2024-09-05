import React from 'react'
import SideBar from '../SideBar/SideBar.jsx';
import "./Container.scss";
import AuditLogs from '../AuditLogs/AuditLogs.jsx';


const Container = () => {
  return (
    <div id='Container'>
    <SideBar />
    <AuditLogs />
    </div>
  )
}

export default Container;