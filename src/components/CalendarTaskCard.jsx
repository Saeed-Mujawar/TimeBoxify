import { Modal, Button, Input, Select, Form } from "antd";
import { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaComment,
  FaEnvelope,
  FaLaptopCode,
  FaUserAlt,
  FaCalendarAlt,
  FaBrain,
  FaBook,
  FaTools,
} from "react-icons/fa";

const { Option } = Select;

const CalendarTaskCard = ({
  visible,
  onClose,
  selectedEvent,
  onSubmit,
  onDelete,
  onMoveToBacklog,
}) => {
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState([]); // Use an array for the key

  // Set form values when an event is selected
  useEffect(() => {
    if (selectedEvent) {
      form.setFieldsValue(selectedEvent);
      setSelectedKey(selectedEvent.key || []); // Load selected key if any
    } else {
      form.resetFields();
      setSelectedKey([]); // Reset key for new task
    }
  }, [selectedEvent, visible]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values, selectedKey); // Pass values and selected key to parent
      onClose();
    })
    .catch((info) => console.log("Form validation failed:", info));
  };

  const handleActionClick = (actionKey) => {
    setSelectedKey((prev) =>
      prev.includes(actionKey)
        ? prev.filter((key) => key !== actionKey) // Deselect if already selected
        : [...prev, actionKey] // Select if not already selected
    );
  };

  const actions = [
    { key: "call", icon: <FaPhoneAlt />, text: "Call" },
    { key: "message", icon: <FaComment />, text: "Message" },
    { key: "email", icon: <FaEnvelope />, text: "Email" },
    { key: "online", icon: <FaLaptopCode />, text: "Online" },
    { key: "inPerson", icon: <FaUserAlt />, text: "In-Person" },
    { key: "scheduleLater", icon: <FaCalendarAlt />, text: "Schedule Later" },
    { key: "deepWork", icon: <FaBrain />, text: "Deep Work" },
    { key: "research", icon: <FaBook />, text: "Research" },
    { key: "admin", icon: <FaTools />, text: "Admin" },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        selectedEvent && (
          <Button key="delete" danger onClick={onDelete}>
            Delete Task
          </Button>
        ),
        selectedEvent && (
          <Button key="backlog" type="dashed" onClick={onMoveToBacklog}>
            Move to Prioritization
          </Button>
        ),
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {selectedEvent ? "Save Changes" : "Create Task"}
        </Button>,
      ]}
      closable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input the Task title!" }]}
        >
          <Input placeholder="Enter task title here" />
        </Form.Item>

        <Form.Item name="description">
          <Input.TextArea placeholder="Enter the details of your task here" />
        </Form.Item>

        <Form.Item
          name="priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
          <Select placeholder="Select task priority here">
            <Option value="nice-to-do">Nice-To-Do</Option>
            <Option value="should-do">Should-Do</Option>
            <Option value="must-do">Must-Do</Option>
            <Option value="diligent">Diligent</Option>
          </Select>
        </Form.Item>

        {/* Action Buttons Section */}
        <div className="actions-section">
          {/* <h4>Select Actions:</h4> */}
          <div className="actions-grid" style={{ borderColor: "lightgrey", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px",margin: "1px" }}>
            {actions.map(({ key, icon, text }) => (
              <button
                key={key}
                className={`action-item ${
                  selectedKey.includes(key) ? "selected" : ""
                }`}
                onClick={() => handleActionClick(key)}
              >
                <span className="action-icon">{icon}</span>
                <span className="action-text">{text}</span>
              </button>
            ))}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CalendarTaskCard;