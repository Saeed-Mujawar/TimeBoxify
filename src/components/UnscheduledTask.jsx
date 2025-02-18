import React, { useState, useEffect, useRef } from "react";
import { Empty } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import "./UnscheduledTask.css";
import EditTaskModal from "./helperComponents/EditTaskModal";
import TaskCard from "./TaskCard";

const UnscheduledTask = ({ tasks, setTasks, onDrop }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!tasks.length) {
      const storedTasks = JSON.parse(localStorage.getItem("unscheduledEvents")) || [];
      setTasks(storedTasks);
    }
  }, [tasks.length, setTasks]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       handleCloseModal();
  //     }
  //   };

  //   if (selectedTask) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [selectedTask]);

  const updateLocalStorage = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("unscheduledEvents", JSON.stringify(newTasks));
  };

  // const handleOpenModal = (task) => {
  //   setSelectedTask(task);
  // };

  // const handleCloseModal = () => {
  //   setSelectedTask(null);
  // };

  const handleDelete = (taskId) => {
    updateLocalStorage(tasks.filter((task) => task.id !== taskId));
    // handleCloseModal();
  };

  const onDragStart = (e, event) => {
    e.dataTransfer.setData("application/json", JSON.stringify(event));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedData = JSON.parse(e.dataTransfer.getData("application/json"));
    const updatedTask = { ...droppedData, priority: "" };

    onDrop(droppedData.id);

    // Prevent duplicate insertion
    setTasks((prev) => {
      if (!prev.some((task) => task.id === updatedTask.id)) {
        const newTasks = [...prev, updatedTask];
        localStorage.setItem("unscheduledEvents", JSON.stringify(newTasks));
        return newTasks;
      }
      return prev;
    });
  };

  const handleUpdate = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    updateLocalStorage(updatedTasks); // Update local storage
  };

  return (
    <div className="external-tasks-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <h3 className="external-tasks-title">Backlog Tasks</h3>
      <div className="external-tasks">
        {tasks.length === 0 ? (
          <Empty
            description=""
            image={<WarningOutlined style={{ fontSize: 70, color: "grey", marginTop: "30px" }} />}
          />
        ) : (
          tasks.map((task) => (
            <div key={task.id} draggable onDragStart={(e) => onDragStart(e, task)}>
              <TaskCard task={task} onDelete={handleDelete} onUpdate={handleUpdate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnscheduledTask;