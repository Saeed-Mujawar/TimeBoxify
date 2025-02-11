import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import "./TaskCalendar.css";
import BacklogEvent from "./BacklogEvent";
import TaskInput from "./TaskInput";

const { Option } = Select;
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TaskCalendar = () => {
  const [backLogEvents, setBackLogEvents] = useState(() => {
    // Load backlog events from localStorage on component mount
    const savedBacklogEvents = JSON.parse(localStorage.getItem("backlogEvents")) || [];
    return savedBacklogEvents;
  });
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingHours, setWorkingHours] = useState(() => {
    // Load working hours from localStorage or use default values
    const savedWorkingHours = JSON.parse(localStorage.getItem("workingHours"));
    return savedWorkingHours || { start: 9, end: 17 };
  });  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTime, setNewEventTime] = useState(null);
  const [form] = Form.useForm();
  const startOfWeek = moment(currentDate).startOf("week").toDate();

  // Save backlog events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("backlogEvents", JSON.stringify(backLogEvents));
  }, [backLogEvents]);

  useEffect(() => {
    // Save working hours to localStorage whenever they change
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

  const handleSelectSlot = ({ start, end }) => {
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
      priority: event.priority || "low",
    });
    setShowModal(true);
  };

  const handleNavigate = (date) => {
    const startOfWeek = moment(date).startOf("week").toDate(); // Get the start of the week
    setCurrentDate(startOfWeek); // Update currentDate to the start of the week
  };
  const onDragStart = (e, event) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(event));
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { start, end } = getSlotInfo(e); // Get the drop position (start and end time)

    const newEvent = {
      ...eventData,
      start,
      end,
      id: Date.now(), // Generate a unique ID for the new event
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Remove the event from backlog and update localStorage
    setBackLogEvents((prevBacklog) => {
      const updatedBacklog = prevBacklog.filter((event) => event.id !== eventData.id);
      localStorage.setItem("backlogEvents", JSON.stringify(updatedBacklog)); // Sync immediately
      return updatedBacklog;
    });
  
    notification.success({
      message: "Event Added",
      description: `The event "${eventData.title}" was successfully added to the calendar.`,
    });
  };

  const getSlotInfo = (e) => {
    const calendarBounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - calendarBounds.left; // X position relative to the calendar
    const y = e.clientY - calendarBounds.top; // Y position relative to the calendar

    // Calculate the time slot based on the mouse position
    const slotWidth = calendarBounds.width / 7; // Divide by 7 days in a week
    const slotHeight = calendarBounds.height / (workingHours.end - workingHours.start); // Divide by working hours

    const dayIndex = Math.floor(x / slotWidth); // Day of the week (0 = Sunday, 6 = Saturday)
    const hourIndex = Math.floor(y / slotHeight); // Hour of the day (0 = workingHours.start)

    const start = new Date(startOfWeek); 
    start.setDate(start.getDate() + dayIndex); // Set the day based on calculated index
    start.setHours(workingHours.start + hourIndex, 0, 0, 0); // Set the hour

    const end = new Date(start);
    end.setHours(start.getHours() + 1); // Default duration: 1 hour

    return { start, end };
  };



  const handleEventDelete = () => {
    if (selectedEvent) {
      // Delete the event from the state
      const updatedEvents = events.filter((evt) => evt.id !== selectedEvent.id);

      // Save the updated events back to localStorage
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));

      // Update the state with the new events list
      setEvents(updatedEvents);

      // Close the modal
      setShowModal(false);

      // Show a success notification
      notification.success({
        message: "Event Deleted",
        description: `The event "${selectedEvent.title}" was successfully deleted.`,
      });
    }
  };

  const handleEventMove = ({ event, start, end }) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) => (evt.id === event.id ? { ...evt, start, end } : evt))
    );
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { title, description, priority } = values;

        if (selectedEvent) {
          setEvents((prevEvents) =>
            prevEvents.map((evt) =>
              evt.id === selectedEvent.id ? { ...evt, title, description, priority } : evt
            )
          );
          notification.success({
            message: "Event Updated",
            description: `The event "${title}" was successfully updated.`,
          });
        } else if (newEventTime) {
          const newEvent = {
            start: newEventTime.start,
            end: newEventTime.end,
            title,
            description,
            priority,
            id: Date.now(),
          };
          setEvents((prevEvents) => [...prevEvents, newEvent]);
          notification.success({
            message: "Event Created",
            description: `The event "${title}" was successfully created.`,
          });
        }
        setShowModal(false);
      })
      .catch((info) => console.log("Form validation failed:", info));
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.priority) {
      case "high":
        backgroundColor = "#ff4d4f";
        break;
      case "medium":
        backgroundColor = "#faad14";
        break;
      case "low":
      default:
        backgroundColor = "#52c41a";
        break;
    }
    return { style: { backgroundColor, color: "#fff", borderRadius: "4px", border: "none" } };
  };
  const handleAddTask = (newTask) => {
    setBackLogEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newTask];
      localStorage.setItem("backlogEvents", JSON.stringify(updatedEvents)); // Sync immediately
      return updatedEvents;
    });
  
    notification.success({
      message: "Task Added",
      description: `The task "${newTask.title}" was successfully added to the backlog.`,
    });
  };



  const minTime = new Date();
  minTime.setHours(workingHours.start, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(workingHours.end, 0, 0);

  const handleBacklogTask = () => {
    if (selectedEvent) {
      const { title, description, priority, id } = selectedEvent;
      setBackLogEvents((prevEvents) => [...prevEvents, { title, description, priority, id }]);
      localStorage.setItem("backlogEvents", JSON.stringify([...backLogEvents, { title, description, priority, id }]));
      handleEventDelete();
      setShowModal(false);
      notification.success({
        message: "Task Added to Backlog",
        description: `The task "${title}" was successfully moved to backlog.`,
      });
    }
  };

  return (
    <div className="calendar-container">
      <div className="top-section">
        {/* TaskInput and Event side by side */}
        <TaskInput onAddTask={handleAddTask} />
        <BacklogEvent events={backLogEvents} setEvents={setBackLogEvents} onDragStart={onDragStart} />
      </div>
      <h3 className="external-events-title">Calendar</h3>
      <div className="working-hour-box">
        <div className="working-hours-container">
          <label className="working-hours-label">Set Working Hours:</label>
          <div className="working-hours-inputs">
            <input
              type="number"
              value={workingHours.start}
              min={0}
              max={23}
              onChange={(e) => setWorkingHours({ ...workingHours, start: Number(e.target.value) })}
              className="working-hours-input"
            />
            <span className="working-hours-separator"> to </span>
            <input
              type="number"
              value={workingHours.end}
              min={1}
              max={24}
              onChange={(e) => setWorkingHours({ ...workingHours, end: Number(e.target.value) })}
              className="working-hours-input"
            />
          </div>
        </div>

      </div>

      <Modal
        title={selectedEvent ? "Edit Event" : "Create Event"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          selectedEvent && (
            <Button key="delete" danger onClick={handleEventDelete}>
              Delete Event
            </Button>
          ),
          selectedEvent && (
            <Button key="backlog" type="dashed" onClick={handleBacklogTask}>
              Move to Backlog
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            {selectedEvent ? "Save Changes" : "Create Event"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="eventForm">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the event title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select a priority!" }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <div
        className="calendar-wrapper"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()} // Required to allow dropping
      >
        <DnDCalendar
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
          formats={{
            week: {
              startOfWeek: "Monday", // Ensure Monday is the start of the week
            },
          }}
        />
      </div>
    </div>
  );
};

export default TaskCalendar;


