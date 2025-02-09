import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import "./TaskCalendar.css";

const { Option } = Select;
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TaskCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingHours, setWorkingHours] = useState({ start: 9, end: 17 });
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTime, setNewEventTime] = useState(null);
  const [form] = Form.useForm();

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

  const minTime = new Date();
  minTime.setHours(workingHours.start, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(workingHours.end, 0, 0);

  return (
    <div className="calendar-container">
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

      <Modal
        title={selectedEvent ? "Edit Event" : "Create Event"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
            Cancel
          </Button>,
          selectedEvent && (
            <Button key="delete" danger onClick={handleEventDelete}>
              Delete Event
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

      <div className="calendar-wrapper">
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
          onNavigate={(date) => setCurrentDate(date)}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventEdit}
          onEventDrop={handleEventMove}
          onEventResize={handleEventMove}
          eventPropGetter={eventStyleGetter}
          min={minTime}
          max={maxTime}
          // step={15}
        />
      </div>
    </div>
  );
};

export default TaskCalendar;


