import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRouter from "./route/AppRouter.jsx";
import React, { useState } from "react";

function App() {

  return (
    <BrowserRouter>
      {/* เรียกใช้งานชุดเส้นทางที่เราตั้งค่าไว้ */}
      <AppRouter />
    </BrowserRouter>
  ) ;
}

export default App
