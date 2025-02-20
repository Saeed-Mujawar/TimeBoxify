import { Modal, Button, Input, Select, Form } from "antd";
import { useEffect } from "react";

const { Option } = Select;

const CalendarTaskCard = ({ 
  visible, 
  onClose, 
  selectedEvent, 
  onSubmit, 
  onDelete, 
  onMoveToBacklog 
}) => {
  const [form] = Form.useForm();

  // Set form values when an event is selected
  useEffect(() => {
    if (selectedEvent) {
      form.setFieldsValue(selectedEvent);
    } else {
        form.resetFields();
    }
  }, [selectedEvent, visible]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {        
      onSubmit(values);
      onClose();
    })
    .catch((info) => console.log("Form validation failed:", info));
  };

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
          <Input.TextArea placeholder="Enter the details of your task here"/>
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
      </Form>
    </Modal>
  );
};

export default CalendarTaskCard;
