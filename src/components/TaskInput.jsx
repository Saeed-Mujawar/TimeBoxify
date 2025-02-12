import React, { useState } from "react";
import { Select, Input, Button } from "antd";
import "./TaskInput.css";

const { Option } = Select;

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

    return (
        <div className="task-input-container">
            <Input
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="task-input"
            />
            {/* <Input.TextArea  // Description field
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="task-description-input"
                rows={4}  // Set the number of visible rows for the textarea
            /> */}
            <div className="task-select-button-container"> {/*  Wrap Select and Button in this div */}
                {/* <Select
                    value={priority}
                    onChange={setPriority}
                    className="task-priority-select"
                >
                    <Option value="nice-to-do">Nice-To-Do</Option>
                    <Option value="should-do">Should-do</Option>
                    <Option value="must-do">Must do</Option>
                    <Option value="diligent">Diligent</Option>
                </Select> */}
                <Button type="primary" onClick={handleAddTask}>
                    Add Task
                </Button>
            </div>
        </div>
    );
};

export default TaskInput;