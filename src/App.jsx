import React, { useState, useEffect, useCallback } from 'react';
import TaskInput from './components/TaskInput';
import TaskBacklog from './components/TaskBacklog';
import Prioritization from './components/Prioritization';
import Calendar from './components/Calendar';
import './App.css';
import Navbar from './components/Navbar.tsx';

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

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update localStorage after deletion
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

  // Update task in the list
  const updateTaskInList = (taskId, newText) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      );
      // Update localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  return (
    <div className="app">
      <Navbar /> 
      <TaskInput addTask={addTask} />
      <TaskBacklog tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} updateTaskInList={updateTaskInList} />
      <Prioritization tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} updateTaskInList={updateTaskInList}/>
      <Calendar tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} updateTaskDuration={updateTaskDuration} updateTaskInList={updateTaskInList}/>
    </div>
  );
};

export default App;
