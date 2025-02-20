import React, { useState, useEffect } from "react";
import {
    DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PhoneOutlined,
    MessageOutlined, MailOutlined, DesktopOutlined, UserOutlined,
    CalendarOutlined, SearchOutlined, ToolOutlined, BookOutlined
} from "@ant-design/icons";
import { FaPhoneAlt, FaComment, FaEnvelope, FaDesktop, FaUserAlt, FaCalendarAlt,  FaBook, FaTools, FaBrain, FaLaptopCode } from 'react-icons/fa';
import "./TaskCard.css";

const TaskCard = ({ task, onClose, onDelete, onUpdate, priorityNumber, visible, priorityColor }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [selectedActions, setSelectedActions] = useState(task.key || []);
    const [taskDuration, setTaskDuration] = useState(task.taskDuration || 15); // Default 15 min

    useEffect(() => {
        onUpdate({ ...task, title, description, key: selectedActions, taskDuration });
    }, [title, description, selectedActions, taskDuration]);

    const handleDelete = () => onDelete(task.id);

    const handleActionClick = (actionKey) => {
        setSelectedActions((prevSelected) =>
            prevSelected.includes(actionKey)
                ? prevSelected.filter((key) => key !== actionKey)
                : [...prevSelected, actionKey]
        );
    };

    const changeTime = (amount) => {
        setTaskDuration((prev) => Math.max(15, prev + amount)); // Ensures minimum 15 min
    };

    const handleCreateTask = () => {
        // Your logic for creating a new task
        console.log("Create Task clicked!");
    };

    const handleMoveToBacklog = () => {
        // Your logic for moving to backlog
        console.log("Move to Backlog clicked!");
    };

    return (
        <div className="task-card">
            <div className="task-card-header" style={{
                    borderTop: `6px solid ${priorityColor}`,
                  }}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="task-card-title"
                    onFocus={(e) => e.target.select()}  // Select all text when the input is focused
                />
                {priorityNumber &&(
                    <span className="priority-number"
                    style={{
                        backgroundColor: `${priorityColor}`,
                      }}
                    >Priority {priorityNumber}</span>
                )}
                <PlusCircleOutlined className="plus-icon"/>
            </div>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the details of your task here"
                className="task-card-description"
                onFocus={(e) => e.target.select()}  // Select all text when the input is focused
            />
            <div className="actions-grid">
                {[{
                    key: "call", icon: <FaPhoneAlt />, text: "Call"
                }, {
                    key: "message", icon: <FaComment />, text: "Message"
                }, {
                    key: "email", icon: <FaEnvelope />, text: "Email"
                }, {
                    key: "online", icon: <FaLaptopCode />, text: "Online"
                }, {
                    key: "inPerson", icon: <FaUserAlt />, text: "In-Person"
                }, {
                    key: "scheduleLater", icon: <FaCalendarAlt />, text: "Schedule Later"
                }, {
                    key: "deepWork", icon: <FaBrain />, text: "Deep Work"
                }, {
                    key: "research", icon: <FaBook />, text: "Research"
                }, {
                    key: "admin", icon: <FaTools />, text: "Admin"
                }].map(({ key: actionKey, icon, text }) => (
                    <button
                        key={actionKey}
                        className={`action-item ${selectedActions.includes(actionKey) ? "selected" : ""}`}
                        onClick={() => handleActionClick(actionKey)}
                    >
                        <span className="action-icon">{icon}</span>
                        <span className="action-text">{text}</span>
                    </button>
                ))}
            </div>

            <div className="task-footer">
                <DeleteOutlined onClick={handleDelete} className="delete-icon" />

                <div className="task-timer">
                    <MinusCircleOutlined className="time-icon" onClick={() => changeTime(-15)} />
                    <span className="time-text">{taskDuration} min</span>
                    <PlusCircleOutlined className="time-icon" onClick={() => changeTime(15)} />
                </div>
            </div>

            {/* Conditional Rendering of Buttons */}
            {visible && (
                <div className="task-actions">
                    <button onClick={handleMoveToBacklog} className="move-backlog-btn">
                        Move to Backlog
                    </button>
                    <button onClick={handleCreateTask} className="create-task-btn">
                        Create Task
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
