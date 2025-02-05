import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

const Task = ({ task, deleteTask, toggleExpand, expanded }) => {
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
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

    return (
        <div
            key={task.id}
            className="task"
            draggable
            onDragStart={handleDragStart} // Correct drag start event
        >
            <span
                onClick={() => toggleExpand(task.id)} // Toggle expand/collapse on text click
                style={{
                    display: 'inline-block',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer', // Make it clear that the text is clickable
                }}
            >
                {expanded ? task.text : truncatedText}
                {showEllipsis && !expanded && '...'}
            </span>

            {/* Expand/Collapse Button */}
            {showEllipsis && !expanded && (
                <Button
                    type="link"
                    size="small"
                    onClick={showModal} // Show modal on click
                    style={{ padding: 0, marginTop: '5px' }}
                >
                    Show more
                </Button>
            )}

            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
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
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    {task.text} {/* Display full task content */}
                </div>
            </Modal>
        </div>
    );
};

export default React.memo(Task);
