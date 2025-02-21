import React from "react";
import "./HomePage.css"; // Import CSS for styling

const HomePage = ({ onConnect }) => {
  return (
    <div className="home-container">
      <h1>Welcome to Task Scheduler</h1>
      <p>Connect your Google Calendar to manage your tasks efficiently.</p>
      <button className="connect-button" onClick={onConnect}>
        Connect to Google Calendar
      </button>
    </div>
  );
};

export default HomePage;
