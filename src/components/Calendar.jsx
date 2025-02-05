import React, { useState } from 'react';
import Task from './Task';  // Import Task component

const Calendar = ({ tasks, moveTask, deleteTask, updateTaskInList }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 AM to 8:00 PM
    const [expandedTaskId, setExpandedTaskId] = useState(null); // Track expanded task state

    // Handle dragging of tasks into a specific day and time
    const handleDrop = (e, day, hour) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
        if (!taskId) return;
        moveTask(taskId, `${day}-${hour}`);
    };

    // Handle task deletion
    const handleDelete = (taskId) => {
        deleteTask(taskId);
    };

    // Handle the drag start event to transfer task ID
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
    <>
            <h2 className="prioritization-heading">
            Weekly Task Calendar
            </h2>
        <div className="calendar" style={{ width: '98%', overflowX: 'auto', padding: '10px' }}>
            <table className="calendar-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f8f8' }}>
                        <th style={{ width: '80px', padding: '10px', border: '1px solid #ddd' }}>Time</th>
                        {days.map((day) => (
                            <th key={day} style={{ padding: '10px', border: '1px solid #ddd' }}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hours.map((hour) => (
                        <tr key={hour}>
                            <td style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
                                {hour}:00
                            </td>
                            {days.map((day) => (
                                <td
                                    key={`${day}-${hour}`}
                                    style={{
                                        padding: '10px',
                                        minHeight: '80px',
                                        border: '1px solid #ddd',
                                        verticalAlign: 'top',
                                        position: 'relative',
                                        backgroundColor: '#fafafa',
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, day, hour)}
                                >
                                    {/* Task rendering for each hour/day */}
                                    {tasks
                                        .filter((task) => task.zone === `${day}-${hour}`)
                                        .map((task) => {
                                            return (
                                                <Task
                                                    key={task.id}
                                                    task={task}
                                                    deleteTask={handleDelete}
                                                    toggleExpand={() => { }}
                                                    expanded={expandedTaskId === task.id}
                                                    updateTaskInList={updateTaskInList}
                                                />
                                            );
                                        })}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default React.memo(Calendar);
