import React, { useState, useEffect } from "react";
import { Modal, Empty, Input, Button } from "antd";
import './BacklogEvent.css';

const BacklogEvent = ({ events: initialEvents, onDragStart, setEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({});

  useEffect(() => {
    // Load from local storage if events prop is empty
    if (!initialEvents.length) {
      const storedEvents = JSON.parse(localStorage.getItem("backlogEvents")) || [];
      setEvents(storedEvents);
    }
  }, [initialEvents, setEvents]);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setUpdatedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleInputChange = (field, value) => {
    setUpdatedEvent({ ...updatedEvent, [field]: value });
  };

  const handleSave = () => {
    const updatedEvents = initialEvents.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    updateLocalStorage(updatedEvents);
    handleModalClose();
  };

  const handleDelete = (eventId) => {
    const filteredEvents = initialEvents.filter((event) => event.id !== eventId);
    updateLocalStorage(filteredEvents);
    handleModalClose();
  };

  const updateLocalStorage = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem("backlogEvents", JSON.stringify(newEvents));
  };
  
  
  const handleDrop = (e, priority) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId"); 
  
    // Convert eventId to a number for comparison
    const numericEventId = Number(eventId);
  
    const updatedEvents = initialEvents.map((event) => {
      return event.id === numericEventId ? { ...event, priority } : event;
    });

    updateLocalStorage(updatedEvents);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const priorities = [
    { level: "high", color: "rgb(255, 125, 125)" },
    { level: "medium", color: " rgb(250, 173, 20)" },
    { level: "low", color: "rgb(127, 248, 67)" },
  ];

  const sortedEvents = priorities.map((priority) => ({
    ...priority,
    events: initialEvents.filter((event) => event.priority === priority.level),
  }));

  return (
    <div className="external-events-container">
      <h3 className="external-events-title">Backlog Task Prioritization</h3>
      <div className="external-events">
        {sortedEvents.map((priority) => (
          <div
            key={priority.level}
            className="priority-column"
            style={{ backgroundColor: priority.color }}
            onDrop={(e) => handleDrop(e, priority.level)}
            onDragOver={handleDragOver}
          >
            <h4 className="priority-headings">{priority.level.toUpperCase()}</h4>
            {priority.events.length === 0 ? (
              <Empty style description="No Task" />
            ) : (
              priority.events.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("eventId", event.id);
                    onDragStart(e, event);
                  }}
                  className="external-event"
                  onClick={() => handleOpenModal(event)}
                >
                  {event.title}
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {selectedEvent && (
  <Modal
    title="Edit Event"
    visible={isModalOpen}
    onCancel={handleModalClose}
    footer={[
      <Button key="delete" danger onClick={() => handleDelete(selectedEvent.id)}>
        Delete
      </Button>,
      <Button key="save" type="primary" onClick={handleSave}>
        Save
      </Button>
    ]}
  >
    <div>
      <h4>Title</h4>
      <Input
        placeholder="Title"
        value={updatedEvent.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
      />
    </div>

    <div style={{ marginTop: "1rem" }}>
      <h4>Description</h4>
      <Input.TextArea
        placeholder="Description"
        value={updatedEvent.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        rows={4}
      />
    </div>
  </Modal>
)}

    </div>
  );
};

export default BacklogEvent;
