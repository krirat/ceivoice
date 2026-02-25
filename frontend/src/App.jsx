import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EditTicket from './pages/EditTicket';
import JwtDecodeExample from './pages/jwtDecodeExample';
import './App.css'



function App() {
  return (

    <BrowserRouter>
      <nav>
        <Link to="/admin/tickets/:id/edit">edit ticket</Link> |{" "}
        <Link to="/jwt-example">JWT Decode Example</Link> |{" "}
        <Link to= "/">home</Link>
      </nav>

      <Routes>
        <Route path="/admin/tickets/:id/edit" element={<EditTicket />} />  //:id
        <Route path="/jwt-example" element={<JwtDecodeExample />} />
        <Route path="/" />
      </Routes>
    </BrowserRouter>
  );
}



export default App
