import { Header } from "./components/layout/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
