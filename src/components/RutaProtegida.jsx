import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ children, soloRol }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (soloRol && usuario.role_id !== soloRol) {
    return <Navigate to={usuario.role_id === 1 ? "/visitas" : "/pacientes"} replace />;
  }

  return children;
}
