import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const getPopoverContent = (level) => {
  switch (level) {
    case "must-do":
      return (
        <div>
          <strong>Must-Do Tasks:</strong>
          <p>These are your highest-priority tasks. They are critical to your success and have significant consequences if not completed.</p>
          <ul>
            <li>Urgent and important.</li>
            <li>Tasks that contribute directly to your goals or responsibilities.</li>
            <li>Failure to complete these tasks will result in serious negative outcomes (e.g., missed deadlines, financial loss, damaged reputation).</li>
          </ul>
          <strong>Action:</strong>
          <p>Focus on completing "Must-Do" tasks first. Do not move on to other tasks until these are done.</p>
        </div>
      );
    case "should-do":
      return (
        <div>
          <strong>Should-Do Tasks:</strong>
          <p>These are important but not as urgent as "Must-Do" tasks. Completing them is necessary, but the consequences of delaying them are less severe.</p>
          <ul>
            <li>Important but not urgent.</li>
            <li>Tasks that still need attention but can wait if "Must-Do" tasks require immediate focus.</li>
          </ul>
          <strong>Action:</strong>
          <p>Work on "Should-Do" tasks only after all "Must-Do" tasks are completed.</p>
        </div>
      );
    case "nice-to-do":
      return (
        <div>
          <strong>Nice-to-Do Tasks:</strong>
          <p>These are tasks that are nice to do but have no significant consequences if they are not completed.</p>
          <ul>
            <li>Low priority.</li>
            <li>Tasks that may improve efficiency or satisfaction but are not essential.</li>
            <li>Examples include responding to non-critical emails or attending optional meetings.</li>
          </ul>
          <strong>Action:</strong>
          <p>Address "Nice-to-Do" tasks only after both "Must-Do" and "Should-Do" tasks are finished.</p>
        </div>
      );
    case "diligent":
      return (
        <div>
          <strong>Diligent Tasks:</strong>
          <p>These are tasks that can and should be delegated to others.</p>
          <ul>
            <li>Tasks that don’t necessarily require your personal involvement.</li>
            <li>Activities that someone else can handle, freeing up your time for higher-priority work.</li>
          </ul>
          <strong>Action:</strong>
          <p>Delegate "Diligent" tasks to others whenever possible.</p>
        </div>
      );
    default:
      return null;
  }
};

const PriorityHeading = ({ priority }) => (
    
  <h4 className="priority-headings">
    <p></p>
    {priority.level.toUpperCase()}
    <Popover content={getPopoverContent(priority.level)} title="Task Information">
      <InfoCircleOutlined style={{ marginLeft: 8, color: "black", cursor: "pointer", alignItems: 'flex-start' }} />
    </Popover>
  </h4>
);

export default PriorityHeading;
