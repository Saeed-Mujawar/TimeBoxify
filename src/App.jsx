import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.tsx";
import TaskCalendar from "./components/TaskCalendar.jsx";
import TaskInput from "./components/TaskInput.jsx";
import "./App.css";
import BacklogEvent from "./components/BacklogEvent.jsx";
import UnscheduledTask from "./components/UnscheduledTask.jsx";
import TaskCard from "./components/TaskCard.jsx";

const App = () => {

  // Load backlog events from localStorage on component mount
  const [backLogEvents, setBackLogEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("backlogEvents")) || [];
  });

  // Load unscheduled events from localStorage
  const [unscheduledEvents, setUnscheduledEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("unscheduledEvents")) || [];
  });

  // Save backlog events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("backlogEvents", JSON.stringify(backLogEvents));
  }, [backLogEvents]);


  // Save unscheduled events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("unscheduledEvents", JSON.stringify(unscheduledEvents));
  }, [unscheduledEvents]);


  // Function to add a task to backlog
  const handleAddTask = (newTask) => {
    setUnscheduledEvents((prev) => {
      const updatedEvents = [...prev, newTask];
      localStorage.setItem("unscheduledEvents", JSON.stringify(updatedEvents));
      return updatedEvents;
    });

  };

  const onDragStart = (e, event) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(event));
  };

  const handleTaskMove = (taskId) => {
    setUnscheduledEvents((prev) => {
      const updatedUnscheduledEvents = prev.filter((task) => task.id !== taskId);
      localStorage.setItem("unscheduledEvents", JSON.stringify(updatedUnscheduledEvents));
      return updatedUnscheduledEvents;
    });
    setBackLogEvents((prev) => {
      const updatedBackLogEvents = prev.filter((event) => event.id !== taskId);
      localStorage.setItem("backlogEvents", JSON.stringify(updatedBackLogEvents));
      return updatedBackLogEvents;
    });
  };




  return (
    <div className="app"
    >
      <Navbar />
      {/* <TaskCard/> */}
      <TaskInput onAddTask={handleAddTask} />
      <UnscheduledTask tasks={unscheduledEvents} setTasks={setUnscheduledEvents} onDrop={handleTaskMove} />
      <BacklogEvent events={backLogEvents} setEvents={setBackLogEvents} onDragStart={onDragStart} onDrop={handleTaskMove} />
      <TaskCalendar backLogEvents={backLogEvents} setBackLogEvents={setBackLogEvents} />
    </div>
  );
};

export default App;
