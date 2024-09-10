import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { useAuth } from "./context/AuthContext";
import { EmailActivation } from "./components/auth/EmailActivation";
import { Pruebas } from "./components/boards/Pruebas";

function App() {
  const { verifyToken } = useAuth();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pruebas/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email_activation/:param1/:param2" element={<EmailActivation />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
