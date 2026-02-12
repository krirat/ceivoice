import './App.css'
import TeamDashboard from './components/teamDashboard.jsx'

function App() {

  return (
      <TeamDashboard user={{id:1}} team={{id:1, name:"Team 1", admin_id:0}} onBack={() => {}} />
  )
}

export default App
