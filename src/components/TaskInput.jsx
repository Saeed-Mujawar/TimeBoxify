import React, { useState } from 'react';
import { Input, Button } from 'antd';

const TaskInput = ({ addTask }) => {
    const [taskText, setTaskText] = useState('');
    const [expanded, setExpanded] = useState(false);

    // Handle adding a task and updating localStorage
    const handleAddTask = () => {
        if (taskText.trim()) {
            addTask(taskText.trim()); // Add task to the tasks array
            setTaskText(''); // Reset the input field
        }
    };

    // Toggle the expanded state for text area
    const toggleExpand = () => setExpanded(!expanded);

    return (
        <div className="task-input" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Input.TextArea
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Enter a new task"
                rows={expanded ? 6 : 4} // Toggle between expanded and normal size
                style={{ width: '500px', marginRight: '10px', resize: 'none' }}
            />
            <Button type="primary" onClick={handleAddTask}>
                Add Task
            </Button>
        </div>
    );
};

export default React.memo(TaskInput);
