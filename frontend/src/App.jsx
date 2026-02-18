import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EditTicket from './pages/EditTicket';
import './App.css'



function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/admin/tickets/:id/edit">edit ticket</Link> |{" "}

      </nav>

      <Routes>
        <Route path="/admin/tickets/:id/edit" element={<EditTicket />} />  //:id
      </Routes>
    </BrowserRouter>
  );
}



export default App
