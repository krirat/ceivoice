import './App.css'
import { BrowserRouter } from 'react-router-dom';
import TeamDashboard from './components/teamDashboard.jsx'
import AppRouter from "./route/AppRouter.jsx";
function App() {

  return (
    <BrowserRouter>
      {/* เรียกใช้งานชุดเส้นทางที่เราตั้งค่าไว้ */}
      <AppRouter />
    </BrowserRouter>
  ) ;
}

export default App
