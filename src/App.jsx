import Navbar from './components/Navbar.tsx';
import './App.css';
import TaskCalendar from './components/TaskCalendar.jsx';



const App = () => {


  return (
    <div className="app">

      <Navbar /> 
      <TaskCalendar/>
    </div>
  );
};

export default App;

