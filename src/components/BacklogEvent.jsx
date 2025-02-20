import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import "./BacklogEvent.css";
import EditTaskModal from "./helperComponents/EditTaskModal";

const BacklogEvent = ({ events, onDragStart, setEvents, onDrop }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!events.length) {
      const storedEvents = JSON.parse(localStorage.getItem("backlogEvents")) || [];
      setEvents(storedEvents);
    }
  }, [events, setEvents]);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  const handleUpdate = (updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    updateLocalStorage(updatedEvents);
  };

  const handleDelete = (eventId) => {
    const filteredEvents = events.filter((event) => event.id !== eventId);
    updateLocalStorage(filteredEvents);
    handleModalClose();
  };

  const updateLocalStorage = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem("backlogEvents", JSON.stringify(newEvents));
  };

  const handleDrop = (e, priority) => {
    e.preventDefault();
    const droppedData = JSON.parse(e.dataTransfer.getData("application/json"));
  
    onDrop(droppedData.id);

    const updatedEvent = { ...droppedData, priority };

    setEvents((prev) => {
      const filteredEvents = prev.filter(event => event.id !== droppedData.id);
      const newEvents = [...filteredEvents, updatedEvent];
    localStorage.setItem("backlogEvents", JSON.stringify(newEvents));
return newEvents;
    });
  
    localStorage.removeItem("draggingEvent");
  };

  const priorities = [
    { level: "must-do", color: "rgb(255, 135, 135)" },
    { level: "should-do", color: "rgb(255, 192, 67)" },
    { level: "nice-to-do", color: "rgb(150, 255, 97)" },
    { level: "diligent", color: "rgb(145, 147, 255)" },
  ];

  const sortedEvents = priorities.map((priority) => ({
    ...priority,
    events: events.filter((event) => event.priority === priority.level),
  }));

  return (
    <div className="external-events-container">
      <h3 className="external-events-title">Task Prioritization</h3>
      <div className="external-events">
        {sortedEvents.map((priority) => (
          <div
            key={priority.level}
            className="priority-column"
            onDrop={(e) => handleDrop(e, priority.level)}
            onDragOver={(e) => e.preventDefault()}
          >
            <h4 className="priority-headings">{priority.level.toUpperCase()}</h4>
            <div className="priority-column-inner">
            {priority.events.length === 0 ? (
              <Empty
                description=""
                image={<WarningOutlined style={{ fontSize: 50, color: 'grey', marginTop: '45px' }} />}
              />
            ) : (
              priority.events.map((event, index) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/json", JSON.stringify(event));
                    localStorage.setItem("draggingEvent", JSON.stringify(event));
                    onDragStart(e, event);
                  }}
                  className="external-event"
                  style={{
                    borderTop: `6px solid ${priority.color}`,
                  }}
                  onClick={() => handleOpenModal(event)}
                >
                  <span>
                    {event.title.length > 22 ? `${event.title.slice(0, 22)}...` : event.title}
                    {/* {event.title} */}
                  </span>
                  <span 
                    className="priority-number"
                    style={{
                      backgroundColor: `${priority.color}`,
                    }}
                  >Priority {index + 1}</span>
                </div>
              ))
            )}
          </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EditTaskModal
          task={selectedEvent}
          priorityNumber={
            sortedEvents
              .find(p => p.level === selectedEvent.priority)
              ?.events.findIndex(event => event.id === selectedEvent.id) + 1
          }
          priorityColor={
            sortedEvents
              .find(p => p.level === selectedEvent.priority)?.color // Find the priority color
          }
          onClose={handleModalClose}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default BacklogEvent;
