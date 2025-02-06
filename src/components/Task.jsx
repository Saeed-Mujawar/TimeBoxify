import React, { useState } from 'react';
import { DeleteOutlined, ExpandOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Input } from 'antd';
import './Task.css'

const Task = ({ task, deleteTask, toggleExpand, expanded, updateTaskInList }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to handle edit mode
  const [editedText, setEditedText] = useState(task.text); // State for the edited text

  const truncatedText = task.text.split('\n')[0]; // Show only the first line
  const showEllipsis = task.text.split('\n').length > 1;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id); // Set task ID for drag
  };

  const showModal = () => {
    setIsModalVisible(true); // Open the modal
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close the modal when OK is clicked
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal when Cancel is clicked
  };

  const handleEditChange = (e) => {
    setEditedText(e.target.value); // Update the edited text as the user types
  };

  const handleSaveEdit = () => {
    updateTaskInList(task.id, editedText); // Update task in parent component
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div
      key={task.id}
      className="task"
      draggable
      onDragStart={handleDragStart} // Correct drag start event
    >
      {/* Left side content (task text and expanded button) */}
      <div className="task-text-container">
        <span
          onClick={() => toggleExpand(task.id)} // Toggle expand/collapse on text click
          className={`task-text ${expanded ? 'expanded' : ''}`}
        >
          {expanded ? task.text : truncatedText}
        </span>
      </div>

      {/* Right side content (Expand button and delete button) */}
      <div className="delete-btn-container">
        <Button
          type="text"
          icon={<ExpandOutlined />}
          onClick={showModal} // Open modal on click
          size="small"
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => deleteTask(task.id)} // Delete task
          size="small"
        />
      </div>

      {/* Modal for showing full content */}
      <Modal
        title="Task Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }} // Hide the cancel button if not needed
      >
        {/* Display full task content */}
        {isEditing ? (
          <>
            <Input.TextArea
              value={editedText}
              onChange={handleEditChange}
              rows={4}
            />
            <Button
              type="primary"
              onClick={handleSaveEdit}
              style={{ marginTop: '10px' }}
            >
              Save Edit
            </Button>
          </>
        ) : (
          <div className="task-modal">
            {task.text} {/* Display full task content */}
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)} 
              style={{ marginTop: '10px' }}
            >
              Edit
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(Task);
