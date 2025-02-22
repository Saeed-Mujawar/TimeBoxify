import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Modal, Form, Input, Select, Button, notification, InputNumber, Alert } from "antd";
import "./TaskCalendar.css";

import CalendarTaskCard from "./CalendarTaskCard";

// Get today's day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const today = new Date();
const startOfWeekDay = today.getDay(); // Dynamically get today's day of the week

// Set the start of the week to today's day
moment.updateLocale('en', {
  week: {
    dow: startOfWeekDay, // Set the start of the week to today's day
  },
});

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TaskCalendar = ({ backLogEvents, setBackLogEvents }) => {

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingHours, setWorkingHours] = useState(() => {
    const savedWorkingHours = JSON.parse(localStorage.getItem("workingHours"));
    return savedWorkingHours || { start: 9, end: 17 };
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTime, setNewEventTime] = useState(null);
  const [form] = Form.useForm();
  const startOfWeek = moment(currentDate).startOf("week").toDate();
  const [error, setError] = useState(null);

  const handleStartChange = (value) => {
    if (value === null || value < 0 || value > 22) {  // start time can be between 0 and 22
      setError("Start time must be between 0 and 22.");
      return;
    }

    if (value >= workingHours.end) {
      setError("Start time must be less than end time.");
      return;
    }

    const updatedHours = { ...workingHours, start: value };
    setWorkingHours(updatedHours);
    localStorage.setItem("workingHours", JSON.stringify(updatedHours));
    setError("");
  };

  const handleEndChange = (value) => {
    if (value === null || value < 1 || value > 23) {  // end time must be between 1 and 23
      setError("End time must be between 1 and 23.");
      return;
    }

    if (value <= workingHours.start) {
      setError("End time must be greater than start time.");
      return;
    }

    const updatedHours = { ...workingHours, end: value };
    setWorkingHours(updatedHours);
    localStorage.setItem("workingHours", JSON.stringify(updatedHours));
    setError("");
  };


  // Save backlog events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("backlogEvents", JSON.stringify(backLogEvents));
  }, [backLogEvents]);

  useEffect(() => {
    localStorage.setItem("workingHours", JSON.stringify(workingHours));
  }, [workingHours]);

  // Load events, view, and date from localStorage on component mount
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    const savedDate = localStorage.getItem("calendarDate")
      ? new Date(localStorage.getItem("calendarDate"))
      : new Date();

    const parsedEvents = savedEvents.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

    setEvents(parsedEvents);
    setCurrentDate(savedDate);
  }, []);

  // Save events and current view to localStorage on change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("calendarEvents", JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    localStorage.setItem("calendarDate", currentDate);
  }, [currentDate]);

  const handleSelectSlot = ({ start, end, action }) => {
    // If the action is a drag operation, do nothing
    if (action === "drag") {
      return;
    }

    // Otherwise, open the modal for creating a new event
    setSelectedEvent(null);
    setNewEventTime({ start, end });
    form.resetFields();
    setShowModal(true);
  };

  const handleEventEdit = (event) => {
    setSelectedEvent(event);
    form.setFieldsValue({
      title: event.title,
      description: event.description || "",
      priority: event.priority || "nice-to-do",
    });
    setShowModal(true);
  };

  const handleNavigate = (date) => {
    const startOfWeek = moment(date).startOf("week").toDate(); // Get the start of the week
    setCurrentDate(startOfWeek); // Update currentDate to the start of the week
  };

  const handleEventDelete = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter((evt) => evt.id !== selectedEvent.id);

      setEvents(updatedEvents);

      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      setShowModal(false);

      notification.success({
        message: "Event Deleted",
        description: `The event "${selectedEvent.title}" was successfully deleted.`,
      });
    }
  };

  const handleEventMove = ({ event, start, end }) => {
    const taskDuration = moment(end).diff(moment(start), "minutes");
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === event.id ? { ...evt, start, end, taskDuration } : evt
      )
    );
  };

  const handleFormSubmit = (values, key) => {
    const { title, description, priority } = values;

    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === selectedEvent.id ? { ...evt, title, description, priority, key } : evt
        )
      );
      notification.success({
        message: "Event Updated",
        description: `The event "${title}" was successfully updated.`,
      });
    } else if (newEventTime) {
      const taskDuration = moment(newEventTime.end).diff(moment(newEventTime.start), "minutes");
      const newEvent = {
        start: newEventTime.start,
        end: newEventTime.end,
        title,
        description,
        priority,
        key,
        taskDuration,
        id: Date.now(),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      notification.success({
        message: "Event Created",
        description: `The event "${title}" was successfully created.`,
      });
    }
    setShowModal(false);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.priority) {
      case "must-do":
        backgroundColor = "#ff4d4f";
        break;
      case "should-do":
        backgroundColor = "#faad14";
        break;
      case "nice-to-do":
        backgroundColor = "#52c41a";
        break;
      case "Diligent":
      default:
        backgroundColor = "#5b5dff";
        break;
    }
    return { style: { backgroundColor, color: "#fff", borderRadius: "4px", border: "none" } };
  };

  const minTime = new Date();
  minTime.setHours(workingHours.start, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(workingHours.end, 0, 0);

  const handleBacklogTask = () => {
    if (!selectedEvent) return;

    const { title, description, priority, id, taskDuration, key } = selectedEvent;

    handleEventDelete(); // Ensure event is removed before updating state

    setBackLogEvents((prevBacklog) => {
      const updatedBacklog = [...prevBacklog, { title, description, priority, id, taskDuration, key }];

      localStorage.setItem("backlogEvents", JSON.stringify(updatedBacklog));

      return updatedBacklog;
    });

    setShowModal(false);

    notification.success({
      message: "Task Added to Backlog",
      description: `The task "${title}" was successfully moved to backlog.`,
    });
  };

  const handleDropFromOutside = ({ start }) => {
    const draggedData = localStorage.getItem("draggingEvent");
    if (!draggedData) {
      console.warn("No valid event found in storage.");
      return;
    }

    let eventData;
    try {
      eventData = JSON.parse(draggedData);
    } catch (error) {
      console.error("Error parsing dragged event:", error);
      return;
    }

    // Retrieve backlog events from local storage
    const backlogEvents = JSON.parse(localStorage.getItem("backlogEvents")) || [];

    // Check if the event is from backlog
    const isFromBacklog = backlogEvents.some(event => event.id === eventData.id);
    if (!isFromBacklog) {
      console.warn("Dropped item is not from backlogEvents");
      return;
    }

    // Calculate the end time using taskDuration
    const end = moment(start).add(eventData.taskDuration, "minutes").toDate();
    // console.log(end);
    const newEvent = {
      ...eventData,
      start,
      end,
      id: Date.now(),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Remove from backlog and update local storage
    const updatedBacklog = backlogEvents.filter(event => event.id !== eventData.id);
    setBackLogEvents(updatedBacklog);
    localStorage.setItem("backlogEvents", JSON.stringify(updatedBacklog));
    localStorage.removeItem("draggingEvent"); // Clear after drop

    notification.success({
      message: "Event Added",
      description: `The event "${newEvent.title}" was added successfully.`,
    });

  };

  const dragFromOutsideItem = () => {
    try {
      return JSON.parse(localStorage.getItem("draggingEvent")) || null;
    } catch (error) {
      console.error("Error parsing dragged event:", error);
      return null;
    }
  };

  return (
    <div className="calendar-container">
      <h3 className="calendar-title">Calendar</h3>
      <div className="working-hour-box">
        <div className="working-hours-container">
          <label className="working-hours-label">Set Working Hours:</label>
          <div className="working-hours-inputs">
            <InputNumber
              min={0}
              max={23}
              value={workingHours.start}
              onChange={handleStartChange}
              className="working-hours-input"
            />
            <span className="working-hours-separator"> to </span>
            <InputNumber
              min={1}
              max={24}
              value={workingHours.end}
              onChange={handleEndChange}
              className="working-hours-input"
            />
          </div>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ margin: 10, fontSize: '14px' }}
          />
        )}
        </div>
      </div>

      <CalendarTaskCard
        visible={showModal}
        onClose={() => setShowModal(false)}
        selectedEvent={selectedEvent}
        onSubmit={(values, key) => handleFormSubmit(values, key)}
        onDelete={handleEventDelete}
        onMoveToBacklog={handleBacklogTask}
      />

      <div className="calendar-wrapper">
        <DnDCalendar
          key={events.length} // Force re-render when events change
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          toolbar
          style={{ height: 800 }}
          views={[Views.WEEK]}
          date={currentDate}
          defaultView={Views.WEEK}
          onView={Views.WEEK}
          onDropFromOutside={handleDropFromOutside}
          dragFromOutsideItem={dragFromOutsideItem}
          draggableAccessor={(event) => true}
          onNavigate={handleNavigate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventEdit}
          onEventDrop={handleEventMove}
          onEventResize={handleEventMove}
          eventPropGetter={eventStyleGetter}
          min={minTime}
          max={maxTime}
          step={15} // Each slot represents 15 minutes
          timeslots={4} // One timeslot per step
          components={{
            month: {
              dateHeader: ({ label }) => <strong>{label}</strong>, // Customize month view headers
            },
            week: {
              header: ({ date }) => (
                <div>
                  <strong>{moment(date).format("ddd, DD/MMM/YYYY")}</strong>
                </div>
              ),
            },
          }}
        />
      </div>
    </div>
  );
};

export default TaskCalendar;


