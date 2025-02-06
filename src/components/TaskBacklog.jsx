import React, { useState } from 'react';
import Task from './Task';
import './TaskBacklog.css'

const TaskBacklog = ({ tasks, moveTask, deleteTask, updateTaskInList }) => {
    const backlogTasks = tasks.filter((task) => task.zone === 'backlog');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    

    const toggleExpand = (taskId) => {
        setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
        if (taskId) {
            moveTask(taskId, 'backlog'); // Move task back to backlog
        }
    };

    return (
        <div
            className="task-backlog droppable"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}           
        >
            <h2 className="prioritization-heading">Task Backlog</h2>
            {backlogTasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    toggleExpand={toggleExpand}
                    expanded={expandedTaskId === task.id}
                    updateTaskInList={updateTaskInList}
                />
            ))}
        </div>
    );
};

export default TaskBacklog;
