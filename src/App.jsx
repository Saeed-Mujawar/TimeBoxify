import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.tsx";
import TaskCalendar from "./components/TaskCalendar.jsx";
import TaskInput from "./components/TaskInput.jsx";
import "./App.css";
import BacklogEvent from "./components/BacklogEvent.jsx";
import UnscheduledTask from "./components/UnscheduledTask.jsx";
import HomePage from "./components/HomePage.jsx";

const App = () => {
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem("isConnected") === "true");
  const [tokenClient, setTokenClient] = useState(null);
  const [backLogEvents, setBackLogEvents] = useState(() => JSON.parse(localStorage.getItem("backlogEvents")) || []);
  const [unscheduledEvents, setUnscheduledEvents] = useState(() => JSON.parse(localStorage.getItem("unscheduledEvents")) || []);
  const [isDirected, setIsDirected] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.body.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (!window.google?.accounts) return;
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar",
        callback: (response) => {
          if (response.access_token) {
            console.log("User authenticated");
            setIsConnected(true);
            localStorage.setItem("isConnected", "true");
          } else {
            console.error("Google authentication failed");
          }
        },
      });
      setTokenClient(client);
    };

    !window.google ? loadGoogleScript() : initializeGoogleAuth();
  }, []);

  const handleGoogleConnect = () => {
    if (!tokenClient) return console.error("Google API client not ready");
    tokenClient.requestAccessToken();
  };

  const handleAddTask = (newTask) => {
    setUnscheduledEvents((prev) => {
      const updatedEvents = [...prev, newTask];
      localStorage.setItem("unscheduledEvents", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const handleDirectStart = () => {
    setIsDirected(true);
  };

  const onDragStart = (e, event) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(event));
  };

  const handleTaskMove = (taskId) => {
    setUnscheduledEvents((prev) => {
      const updated = prev.filter((task) => task.id !== taskId);
      localStorage.setItem("unscheduledEvents", JSON.stringify(updated));
      return updated;
    });

    setBackLogEvents((prev) => {
      const updated = prev.filter((event) => event.id !== taskId);
      localStorage.setItem("backlogEvents", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem("isConnected");
    window.location.reload(); // Refresh page to reset state
  };

  return (
    <div className="app">
      <Navbar onDisconnect={handleDisconnect} isConnected={isConnected}  />
      {/* {!isConnected && !isDirected ? (
        <HomePage onConnect={handleGoogleConnect} onDirect={handleDirectStart} />
      ) : ( */}
        <>
          <TaskInput onAddTask={handleAddTask} />
          <UnscheduledTask tasks={unscheduledEvents} setTasks={setUnscheduledEvents} onDrop={handleTaskMove} />
          <BacklogEvent events={backLogEvents} setEvents={setBackLogEvents} onDragStart={onDragStart} onDrop={handleTaskMove} />
          <TaskCalendar backLogEvents={backLogEvents} setBackLogEvents={setBackLogEvents} />
        </>
      {/* )} */}
    </div>
  );
};

export default App;
