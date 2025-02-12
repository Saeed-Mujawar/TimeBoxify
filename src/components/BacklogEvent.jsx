import React, { useState, useEffect } from "react";
import { Modal, Empty, Input, Button } from "antd";
import './BacklogEvent.css';
import { WarningOutlined } from "@ant-design/icons";

const BacklogEvent = ({ events, onDragStart, setEvents, onDrop }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({});

  useEffect(() => {
    // Load from local storage if events prop is empty
    if (!events.length) {
      const storedEvents = JSON.parse(localStorage.getItem("backlogEvents")) || [];
      setEvents(storedEvents);
    }
  }, [events, setEvents]);

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
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    updateLocalStorage(updatedEvents);
    handleModalClose();
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
  
    // Remove the task from both Backlog and Unscheduled lists
    onDrop(droppedData.id);
  
    // Update event with new priority
    const updatedEvent = { ...droppedData, priority };
  
    setEvents((prev) => {
      const filteredEvents = prev.filter(event => event.id !== droppedData.id);
      const newEvents = [...filteredEvents, updatedEvent];
      localStorage.setItem("backlogEvents", JSON.stringify(newEvents));
      return newEvents;
    });
  };


  const priorities = [
    { level: "must-do", color: "rgb(255, 125, 125)" },
    { level: "should-do", color: "rgb(250, 173, 20)" },
    { level: "nice-to-do", color: "rgb(127, 248, 67)" },
    { level: "diligent", color: "#5b5dff" },
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
            style={{ backgroundColor: priority.color }}
            onDrop={(e) => handleDrop(e, priority.level)}
            onDragOver={(e) => e.preventDefault()}
          >
            <h4 className="priority-headings">{priority.level.toUpperCase()}</h4>
            {priority.events.length === 0 ? (
                 <Empty 
                 description="" 
                 image={<WarningOutlined  Outlined style={{ fontSize: 50, color: 'white',marginTop: '45px'  }} />}            
               />
            ) : (
              priority.events.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/json", JSON.stringify(event));
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
