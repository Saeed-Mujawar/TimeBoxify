import React from 'react';
import './TaskCard.css'; // Import CSS file

const TaskCard = () => {
    return (
        <div className="task-card">
            <div className="task-card-header">
                <h4 className="task-title">Title</h4>
                {/* <button className="priority-button">Priority 1 <span className="plus-icon">+</span></button> */}
            </div>
            <div className="task-card-body">
                <p className="task-description">Enter the details of your task here</p>
                <div className="actions-grid">
                    <button className="action-item">
                        <span className="action-icon">📞</span> <span className="action-text">Call</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">💬</span> <span className="action-text">Message</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">📧</span> <span className="action-text">Email</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">💻</span> <span className="action-text">Online</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">👤</span> <span className="action-text">In-Person</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">📅</span> <span className="action-text">Schedule Later</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">📊</span> <span className="action-text">Deep Work</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">📚</span> <span className="action-text">Research</span>
                    </button>
                    <button className="action-item">
                        <span className="action-icon">⚙️</span> <span className="action-text">Admin</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;