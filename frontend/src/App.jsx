import './App.css'
import { BrowserRouter } from 'react-router-dom';
import TeamDashboard from './components/teamDashboard.jsx'
import AppRouter from "./route/AppRouter.jsx";
import { useState } from 'react';


function App() {
  const [authView, setAuthView] = useState('login');

  const handleLogin = (user) => {
    if (typeof user === 'object') {
        setCurrentUser(user);
        localStorage.setItem('todo_username', user.username);
    } else {
        localStorage.setItem('todo_username', user);
        fetchUserDetails(user);
    }
  }
  const handleLogout = () => {
      localStorage.removeItem('todo_username');
      setCurrentUser(null);
      setAuthView('login');
      setViewMode('personal');
      setActiveTeam(null);
  };



  return (
    <BrowserRouter>
      {/* เรียกใช้งานชุดเส้นทางที่เราตั้งค่าไว้ */}
      <AppRouter />
    </BrowserRouter>
  ) ;
}

export default App
