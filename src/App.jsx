import React, { useState, useEffect, useCallback } from 'react';
import TaskInput from './components/TaskInput';
import TaskBacklog from './components/TaskBacklog';
import Prioritization from './components/Prioritization';
import Calendar from './components/Calendar';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add new task to backlog
  const addTask = useCallback((taskText) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), text: taskText, zone: 'backlog' }, // Assign to 'backlog' zone
    ]);
  }, []);

  // Move task to a new zone (backlog, prioritization, or calendar)
  const moveTask = useCallback((taskId, newZone) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, zone: newZone } : task
      )
    );
  }, []);

  // Delete task from the list
  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const updateTaskDuration = (taskId, newDuration) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, duration: newDuration } : task
      )
    );
  };


  return (
    <div className="app">
      <h1>Weekly Timeboxing & Prioritization</h1>
      <TaskInput addTask={addTask} />
      <TaskBacklog tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} />
      <Prioritization tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} />
      <Calendar tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} updateTaskDuration={updateTaskDuration}/>
    </div>
  );
};

export default App;
