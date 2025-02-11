import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import BacklogEvent from "./BacklogEvent"; // Import the BacklogEvent component
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // State to manage sidebar collapse
  const [backLogEvents, setBackLogEvents] = useState(() => {
      // Load backlog events from localStorage on component mount
      const savedBacklogEvents = JSON.parse(localStorage.getItem("backlogEvents")) || [];
      return savedBacklogEvents;
    });

      // Save backlog events to localStorage whenever they change
      useEffect(() => {
        localStorage.setItem("backlogEvents", JSON.stringify(backLogEvents));
      }, [backLogEvents]);

      const onDragStart = (e, event) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(event));
      };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      className="sidebar-container"
      collapsed={collapsed}
      theme="light" // Light or dark theme
      width={200} // Default width when expanded
      collapsedWidth={80} // Width when collapsed (only icons visible)
    >
      <div className="collapse-button">
        <Button 
          type="text" 
          onClick={handleCollapse} 
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
        />
      </div>
      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />}>
          Calendar
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          Backlog Task
        </Menu.Item>
      </Menu>

      {/* Render the BacklogEvent component inside the sidebar */}
      <div className="backlog-event-container">
        <BacklogEvent 
          events={backLogEvents} 
          setEvents={setBackLogEvents} 
          onDragStart={onDragStart} 
        />
      </div>
    </Sider>
  );
};

export default Sidebar;