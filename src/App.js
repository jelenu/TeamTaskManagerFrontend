import React, { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { useAuth } from "./context/AuthContext";
import { EmailActivation } from "./components/auth/EmailActivation";
function App() {
  const { verifyToken } = useAuth();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email_activation/:param1/:param2" element={<EmailActivation />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
