import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ListadoVisitas from "./pages/visitas/ListadoVisitas";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/visitas" element={<ListadoVisitas />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;