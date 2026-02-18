import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EditTicket from './pages/EditTicket';
import './App.css'
import AppRouter from "./route/AppRouter.jsx";

function App() {
  // const [authView, setAuthView] = useState('login');

  // const handleLogin = (user) => {
  //   if (typeof user === 'object') {
  //       setCurrentUser(user);
  //       localStorage.setItem('todo_username', user.username);
  //   } else {
  //       localStorage.setItem('todo_username', user);
  //       fetchUserDetails(user);
  //   }
  // }
  // const handleLogout = () => {
  //     localStorage.removeItem('todo_username');
  //     setCurrentUser(null);
  //     setAuthView('login');
  //     setViewMode('personal');
  //     setActiveTeam(null);
  // };


  return (
    <BrowserRouter>
      {/* เรียกใช้งานชุดเส้นทางที่เราตั้งค่าไว้ */}
      <AppRouter />
    </BrowserRouter>
  );
}
// <BrowserRouter>
//   <nav>
//     <Link to="/admin/tickets/:id/edit">edit ticket</Link> |{" "}

//   </nav>

//   <Routes>
//     <Route path="/admin/tickets/:id/edit" element={<EditTicket />} />  //:id
//   </Routes>
// </BrowserRouter>
// );
// }



export default App
