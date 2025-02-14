import React, { useEffect, useRef } from "react";
import "./EditTaskModal.css";
import TaskCard from "../TaskCard";

const EditTaskModal = ({ task ,priorityNumber , onClose, onDelete, onUpdate }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!task) return null;

  return (
    <div className="modal-backdrop">
      <div ref={modalRef} className="modal-content">
        <TaskCard task={task} onClose={onClose} onDelete={onDelete} onUpdate={onUpdate} priorityNumber={priorityNumber}/>
      </div>
    </div>
  );
};

export default EditTaskModal;
