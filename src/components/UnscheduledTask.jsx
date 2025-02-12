import React, { useState, useEffect } from "react";
import { Modal, Empty, Input, Button } from "antd";
import { WarningOutlined  } from '@ant-design/icons';
import "./UnscheduledTask.css";

const UnscheduledTask = ({ tasks, setTasks, onDrop }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({});

  useEffect(() => {
    if (!tasks.length) {
      const storedTasks = JSON.parse(localStorage.getItem("unscheduledEvents")) || [];
      setTasks(storedTasks);
    }
  }, [tasks.length, setTasks]);

  const updateLocalStorage = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("unscheduledEvents", JSON.stringify(newTasks));
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setUpdatedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleInputChange = (field, value) => {
    setUpdatedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateLocalStorage(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    handleCloseModal();
  };

  const handleDelete = (taskId) => {
    updateLocalStorage(tasks.filter((task) => task.id !== taskId));
    handleCloseModal();
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
  

  return (
    <div className="external-tasks-container"
        onDrop={handleDrop} 
        onDragOver={(e) => e.preventDefault()}
    >
      <h3 className="external-tasks-title">Backlog Tasks</h3>
      <div className="external-tasks" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {tasks.length === 0 ? (
          <Empty 
            description="" 
            image={<WarningOutlined  Outlined style={{ fontSize: 70, color: 'black',marginTop: '30px'  }} />}            
          />
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task)}
              className="external-task"
              onClick={() => handleOpenModal(task)}
            >
              {task.title}
            </div>
          ))
        )}
      </div>

      <Modal
        title="Edit Task"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="delete" danger onClick={() => handleDelete(selectedTask.id)}>
            Delete
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Input
          placeholder="Title"
          value={updatedTask.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <Input.TextArea
          placeholder="Description"
          value={updatedTask.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          style={{ marginTop: "1rem" }}
        />
      </Modal>
    </div>
  );
};

export default UnscheduledTask;
