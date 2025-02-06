import React, { useState } from 'react';
import Task from './Task'; // Import Task component

const Calendar = ({ tasks, moveTask, deleteTask, updateTaskInList }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 AM to 8:00 PM
  const timeSlots = ['00', '15', '30', '45']; // 15-minute intervals

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Handle dragging tasks into a specific day and time slot
  const handleDrop = (e, day, hour, slot) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
    if (!taskId) return;
    moveTask(taskId, `${day}-${hour}:${slot}`); // Update task zone with specific time slot
  };

  return (
    <>
      <h2 className="prioritization-heading">Weekly Task Calendar</h2>
      <div className="calendar" style={{ width: '98%', overflowX: 'auto', padding: '10px' }}>
        <table className="calendar-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f8f8' }}>
              <th style={{ width: '120px', padding: '10px', border: '1px solid #ddd' }}>Time</th>
              {days.map((day) => (
                <th key={day} style={{ padding: '10px', border: '1px solid #ddd' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <tr>
                  {/* Displaying all time slots in one cell */}
                  <td style={{
                    textAlign: 'center',
                    padding: '10px',
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                  }}>
                    {timeSlots.map(slot => (
                      <div style={{
                        height: '50px', // Each slot is 20px tall
                        borderBottom: '1px solid #eee', // Visual separator for slots
                        position: 'relative',
                        alignContent:'center'
                      }} key={slot}>{`${hour}:${slot}` }</div>
                    ))}
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
                    >
                      {/* Render 15-minute slots within each hour/day cell */}
                      {timeSlots.map((slot) => (
                        <div
                          key={`${day}-${hour}:${slot}`}
                          style={{
                            height: '50px', // Each slot is 20px tall
                            borderBottom: '1px solid #eee', // Visual separator for slots
                            position: 'relative',
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, day, hour, slot)} // Handle drop for specific slot
                        >
                          {/* Task rendering for each 15-minute slot */}
                          {tasks
                            .filter((task) => task.zone === `${day}-${hour}:${slot}`)
                            .map((task) => (
                              <Task
                                key={task.id}
                                task={task}
                                deleteTask={() => deleteTask(task.id)}
                                expanded={expandedTaskId === task.id}
                                updateTaskInList={updateTaskInList}
                              />
                            ))}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default React.memo(Calendar);