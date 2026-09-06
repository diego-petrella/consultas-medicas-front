import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ListadoVisitas from "./pages/visitas/ListadoVisitas";
import ListadoObrasSociales from "./pages/obras-sociales/ListadoObrasSociales";
import AtencionMedica from "./pages/atencion/AtencionMedica";
import DetallePaciente from "./pages/pacientes/DetallePaciente";
import BuscarPaciente from "./pages/pacientes/BuscarPaciente";
import RutaProtegida from "./components/RutaProtegida";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/visitas"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <ListadoVisitas />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/obras-sociales"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <ListadoObrasSociales />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/atencion/:pacienteId"
            element={
              <RutaProtegida soloRol={2}>
                <Layout>
                  <AtencionMedica />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/pacientes"
            element={
              <RutaProtegida>
                <Layout>
                  <BuscarPaciente />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/pacientes/:id"
            element={
              <RutaProtegida>
                <Layout>
                  <DetallePaciente />
                </Layout>
              </RutaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
