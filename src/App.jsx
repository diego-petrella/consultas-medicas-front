import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ListadoVisitas from "./pages/visitas/ListadoVisitas";
import ListadoObrasSociales from "./pages/obras-sociales/ListadoObrasSociales";
import AtencionMedica from "./pages/atencion/AtencionMedica";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/visitas" element={<ListadoVisitas />} />
          <Route path="/obras-sociales" element={<ListadoObrasSociales />} />
          <Route path="/atencion/:pacienteId" element={<AtencionMedica />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;