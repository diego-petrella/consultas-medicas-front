import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ListadoVisitas from "./pages/visitas/ListadoVisitas";
import FormularioVisita from "./pages/visitas/FormularioVisita";
import ListadoDoctores from "./pages/doctores/ListadoDoctores";
import FormularioDoctor from "./pages/doctores/FormularioDoctor";
import ListadoObrasSociales from "./pages/obras-sociales/ListadoObrasSociales";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
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
            path="/visitas/nueva"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <FormularioVisita />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/visitas/editar/:id"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <FormularioVisita />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/doctores"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <ListadoDoctores />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/doctores/nuevo"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <FormularioDoctor />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/doctores/editar/:id"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <FormularioDoctor />
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
            path="/admin/usuarios"
            element={
              <RutaProtegida soloRol={1}>
                <Layout>
                  <GestionUsuarios />
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

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
