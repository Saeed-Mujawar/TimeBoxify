import React, { useState, useEffect, useCallback } from 'react';
import TaskInput from './components/TaskInput';
import TaskBacklog from './components/TaskBacklog';
import Prioritization from './components/Prioritization';
import Calendar from './components/Calendar';
import Navbar from './components/Navbar.tsx';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createResizePlugin } from '@schedule-x/resize';
import './App.css';
import { createEventsServicePlugin } from '@schedule-x/events-service';

const App = () => {
  // Sample events array
  const sampleEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      start: '2025-03-03 10:00',
      end: '2025-03-03 11:00',
      description: 'Discuss project status and upcoming deadlines',
    },
    {
      id: 2,
      title: 'Code Review',
      start: '2025-03-04 14:00',
      end: '2025-03-04 15:00',
      description: 'Review pull requests and provide feedback',
    },
    {
      id: 3,
      title: 'Client Presentation',
      start: '2025-03-05 09:00',
      end: '2025-03-05 10:30',
      description: 'Present the latest product demo to the client',
      
    },
    {
      id: 4,
      title: 'Sprint Planning',
      start: '2025-03-06 13:00',
      end: '2025-03-06 14:00',
      description: 'Plan the next sprint tasks and milestones',
    },
    {
      id: 5,
      title: 'Lunch Break',
      start: '2025-03-03 12:00',
      end: '2025-03-03 13:00',
      description: 'Take a break and have lunch',
    },
  ];

  // Initialize the calendar app
  const calendar = useCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid(),
    ],
    events: sampleEvents,  // Pass the sample events to the calendar
    // selectedDate: '2025-03-03',
    plugins: [
      createDragAndDropPlugin(),
      createEventModalPlugin(),
      createResizePlugin(),
      createEventsServicePlugin(),
    ],
  });


  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = useCallback((taskText) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), text: taskText, zone: 'backlog' },
    ]);
  }, []);

  const moveTask = useCallback((taskId, newZone) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, zone: newZone } : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const updateTaskDuration = (taskId, newDuration) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, duration: newDuration } : task
      )
    );
  };

  const updateTaskInList = (taskId, newText) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  const handleCalendarDrop = (e) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
    const taskText = e.dataTransfer.getData('taskText');
    const date = e.target.getAttribute('data-date');

    if (taskId && date) {
      const newEvent = {
        id: taskId,
        title: taskText,
        start: `${date}T00:00`,
        end: `${date}T01:00`,
        description: taskText,
      };

      calendar.events.add(newEvent);
      moveTask(taskId, 'calendar');
    }
  };

  return (
    <div className="app">
      <Navbar />
      <TaskInput addTask={addTask} />
      <TaskBacklog
        tasks={tasks}
        moveTask={moveTask}
        deleteTask={deleteTask}
        updateTaskInList={updateTaskInList}
      />
      <Prioritization
        tasks={tasks}
        moveTask={moveTask}
        deleteTask={deleteTask}
        updateTaskInList={updateTaskInList}
      />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCalendarDrop}
      >
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  );
};

export default App;
