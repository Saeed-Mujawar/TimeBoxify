  const { Option } = Select;
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const TaskCalendar = ({backLogEvents, setBackLogEvents}) => {

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingHours, setWorkingHours] = useState(() => {
    // Load working hours from localStorage or use default values
    const savedWorkingHours = JSON.parse(localStorage.getItem("workingHours"));
    return savedWorkingHours || { start: 9, end: 17 };
  });  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTime, setNewEventTime] = useState(null);
  const [form] = Form.useForm();
  const startOfWeek = moment(currentDate).startOf("week").toDate();

  // Save backlog events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("backlogEvents", JSON.stringify(backLogEvents));
  }, [backLogEvents]);

  useEffect(() => {
    // Save working hours to localStorage whenever they change
    localStorage.setItem("workingHours", JSON.stringify(workingHours));
  }, [workingHours]);

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
      priority: event.priority || "nice-to-do",
    });
    setShowModal(true);
  };
  
  
  return (
    <div className="calendar-container">
        {/* <BacklogEvent events={backLogEvents} setEvents={setBackLogEvents} onDragStart={onDragStart}/> */}
      <h3 className="external-events-title">Calendar</h3>
  

      <Modal
        title={selectedEvent ? "Edit Task" : "Create Task"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          selectedEvent && (
            <Button key="delete" danger onClick={handleEventDelete}>
              Delete Task
            </Button>
          ),
          selectedEvent && (
            <Button key="backlog" type="dashed" onClick={handleBacklogTask}>
              Move to Backlog
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            {selectedEvent ? "Save Changes" : "Create Task"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="eventForm">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the Task title!" }]}
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
              <Option value="nice-to-do">Nice-To-Do</Option>
              <Option value="should-do">Should-Do</Option>
              <Option value="must-do">Must-Do</Option>
              <Option value="diligent">Deiligent</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <div
        className="calendar-wrapper"
        onDrop={handleDrop}
        onDragOver={onDragOver} // Required to allow dropping
        onDrag={onDrag}
      >
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
          onNavigate={handleNavigate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventEdit}
          onEventDrop={handleEventMove}
          onEventResize={handleEventMove}
          eventPropGetter={eventStyleGetter}
          min={minTime}
          max={maxTime}
          step={15} // Each slot represents 15 minutes
          timeslots={4} // One timeslot per step
          components={{
            month: {
              dateHeader: ({ label }) => <strong>{label}</strong>, // Customize month view headers
            },
            week: {
              header: ({ date }) => (
                <div>
                  <strong>{moment(date).format("ddd, DD/MMM/YYYY")}</strong>
                </div>
              ),
            },
          }}
          formats={{
            week: {
              startOfWeek: "Monday", // Ensure Monday is the start of the week
            },
          }}
        />
      </div>
    </div>
  );
};

export default TaskCalendar;