import React from 'react';
import Task from './Task';

const Prioritization = ({ tasks, moveTask, deleteTask }) => {
    const zones = [
        { id: 'must-do', label: 'Must do', color: '#ff6b6b' },
        { id: 'should-do', label: 'Should do', color: '#ffd166' },
        { id: 'nice-to-do', label: 'Nice to do', color: '#06d6a0' },
        { id: 'delegate', label: 'Delegate', color: '#118ab2' },
    ];

    // Handle task drop and move it to the right zone
    const handleDrop = (e, zoneId) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
        if (taskId) {
            moveTask(taskId, zoneId); // Move the task to the new zone
        }
    };

    // Render the prioritization component
    return (
        <div className="prioritization" style={{ display: 'flex', gap: '10px' }}>
            {zones.map((zone) => (
                <div
                    key={zone.id}
                    className="priority-box droppable"
                    onDragOver={(e) => e.preventDefault()} // Allow drag over
                    onDrop={(e) => handleDrop(e, zone.id)} // Handle task drop
                    style={{
                        backgroundColor: zone.color,
                        flex: 1,
                        padding: '10px',
                        minHeight: '150px',
                        borderRadius: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <h3 style={{ textAlign: 'center', color: '#fff' }}>{zone.label}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Render tasks that belong to the current zone */}
                        {tasks
                            .filter((task) => task.zone === zone.id)
                            .map((task) => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    deleteTask={deleteTask} // Ensure deleteTask is passed correctly
                                    toggleExpand={() => {}} // No need for expand functionality
                                    expanded={false} // Tasks are not expanded by default in the prioritization zone
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Prioritization;
