import React, { useState } from 'react';
import Task from './Task'; // Import Task component
import { Button } from 'antd';
import './Calendar.css'

const Calendar = ({ tasks, moveTask, deleteTask, updateTaskInList }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Function to generate work hours array based on user input
    const generateWorkHours = (start, end) => {
        const hoursArray = [];
        for (let hour = start; hour < end; hour++) {
          hoursArray.push(`${hour < 10 ? '0' + hour : hour} :`);
        }
        return hoursArray;
      };

  // State to store user's work hours
  const [workStart, setWorkStart] = useState(8); // Default start hour (8:00 AM)
  const [workEnd, setWorkEnd] = useState(20); // Default end hour (8:00 PM)
  const [hours, setHours] = useState(generateWorkHours(workStart, workEnd)); // Dynamic hours array
  const [expandedTaskId, setExpandedTaskId] = useState(null);



  // Handle user input for work start time
  const handleStartTimeChange = (e) => {
    setWorkStart(Number(e.target.value));
  };

  // Handle user input for work end time
  const handleEndTimeChange = (e) => {
    setWorkEnd(Number(e.target.value));
  };

  // Handle form submit to update the hours array
  const handleSubmit = () => {
    setHours(generateWorkHours(workStart, workEnd)); // Update the hours based on user input
  };

  const timeSlots = ['00', '15', '30', '45']; // 15-minute intervals

  // Handle dragging tasks into a specific day and time slot
  const handleDrop = (e, day, hour, slot) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
    if (!taskId) return;
    moveTask(taskId, `${day}-${hour}:${slot}`); // Update task zone with specific time slot
  };

  return (
    <>
      <h2 className="calender-heading">Weekly Task Calendar</h2>
      
      {/* Input fields to set work hours (only hours, no minutes) */}
      <div style={{ marginTop: '20px', marginLeft: '20px' }}>
        <label>Work Start Time: </label>
        <select value={workStart} onChange={handleStartTimeChange}>
          {Array.from({ length: 24 }, (_, index) => (
            <option key={index} value={index}>
              {index < 10 ? `0${index}` : index}:00
            </option>
          ))}
        </select>

        <label style={{ marginLeft: '10px' }}>Work End Time: </label>
        <select value={workEnd} onChange={handleEndTimeChange}>
          {Array.from({ length: 24 }, (_, index) => (
            <option key={index} value={index + 1}>
              {index + 1 < 10 ? `0${index + 1}` : index + 1}:00
            </option>
          ))}
        </select>

        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ marginLeft: '10px' }}
        >
          Submit
        </Button>
      </div>

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
                        height: '50px',
                        borderBottom: '1px solid #eee',
                        position: 'relative',
                        alignContent: 'center'
                      }} key={slot}>{hour} {slot}</div>
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
                            height: '50px', 
                            borderBottom: '1px solid #eee', 
                            position: 'relative',
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, day, hour, slot)}
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