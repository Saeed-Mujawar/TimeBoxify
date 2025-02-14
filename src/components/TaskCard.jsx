import React, { useState, useEffect } from "react";
import {
    DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PhoneOutlined,
    MessageOutlined, MailOutlined, DesktopOutlined, UserOutlined,
    CalendarOutlined, SearchOutlined, ToolOutlined, BookOutlined
} from "@ant-design/icons";
import "./TaskCard.css";

const TaskCard = ({ task, onClose, onDelete, onUpdate, priorityNumber }) => {
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

    return (
        <div className="task-card">
            <div className="task-card-header">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="task-card-title"
                />
                {priorityNumber &&(
                    <span className="priority-number">Priority {priorityNumber}</span>

                )}
                <PlusCircleOutlined className="plus-icon"/>
                
            </div>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the details of your task here"
                className="task-card-description"
            />
            <div className="actions-grid">
                {[{
                    key: "call", icon: <PhoneOutlined />, text: "Call"
                }, {
                    key: "message", icon: <MessageOutlined />, text: "Message"
                }, {
                    key: "email", icon: <MailOutlined />, text: "Email"
                }, {
                    key: "online", icon: <DesktopOutlined />, text: "Online"
                }, {
                    key: "inPerson", icon: <UserOutlined />, text: "In-Person"
                }, {
                    key: "scheduleLater", icon: <CalendarOutlined />, text: "Schedule Later"
                }, {
                    key: "deepWork", icon: <SearchOutlined />, text: "Deep Work"
                }, {
                    key: "research", icon: <BookOutlined />, text: "Research"
                }, {
                    key: "admin", icon: <ToolOutlined />, text: "Admin"
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

        </div>
    );
};

export default TaskCard;
