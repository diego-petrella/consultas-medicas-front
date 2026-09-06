import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./Layout.css";

const MENU_ADMINISTRATIVO = [
  { to: "/visitas", label: "Visitas" },
  { to: "/doctores", label: "Doctores" },
  { to: "/obras-sociales", label: "Obras Sociales" },
  { to: "/admin/usuarios", label: "Usuarios" },
];

const MENU_COLABORADOR = [{ to: "/pacientes", label: "Pacientes" }];

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const menu = usuario?.role_id === 1 ? MENU_ADMINISTRATIVO : MENU_COLABORADOR;

  async function handleCerrarSesion() {
    try {
      await api.post("/logout");
    } catch {
      // si falla igual cerramos la sesion en el front
    }
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <aside className="layout-sidebar">
        <nav className="layout-menu">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                "layout-menu-item" + (isActive ? " layout-menu-item--activo" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="layout-usuario">
          <div className="layout-usuario-nombre">
            {usuario?.nombre} {usuario?.apellido}
          </div>
          <div className="layout-usuario-rol">{usuario?.rol_nombre}</div>
          <button type="button" className="layout-cerrar-btn" onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="layout-contenido">{children}</main>
    </div>
  );
}
