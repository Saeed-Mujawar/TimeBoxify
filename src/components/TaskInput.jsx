import React, { useState } from "react";
import "./TaskInput.css";


const TaskInput = ({ onAddTask }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");  // State for description
    const [priority, setPriority] = useState("");

    const handleAddTask = () => {
        if (title.trim()) {
            onAddTask({ title, description, priority, id: Date.now() });
            setTitle("");
            setDescription("");
            setPriority("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddTask();
        }
    };

    return (
        <div className="task-input-container">
            <input
                placeholder="Type the title of your task and press enter to add it to the backlog below."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="task-input"
                onKeyPress={handleKeyPress}
            />

            <div className="task-select-button-container">

                <button onClick={handleAddTask}>
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default TaskInput;