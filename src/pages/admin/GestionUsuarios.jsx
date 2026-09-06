// frontend/src/pages/admin/GestionUsuarios.jsx
import { useEffect, useState } from "react";

const initialForm = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  role_id: "",
};

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await fetch("/api/roles", { credentials: "include" });
      if (!res.ok) throw new Error("No se pudieron cargar los roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al cargar los roles");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 409) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "El username ya existe");
        return;
      }

      if (!res.ok) {
        throw new Error("No se pudo crear el usuario");
      }

      const nuevoUsuario = await res.json();
      setUsuarios((prev) => [...prev, nuevoUsuario]);
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el usuario");
    } finally {
      setGuardando(false);
    }
  };

  const nombreRol = (roleId) => {
    const rol = roles.find((r) => r.id === Number(roleId) || r.id === roleId);
    return rol ? rol.name : roleId;
  };

  return (
    <div className="gestion-usuarios">
      <h1>Gestión de Usuarios</h1>

      {error && <p className="gestion-usuarios__error">{error}</p>}

      <form className="gestion-usuarios__form" onSubmit={handleSubmit}>
        <div className="gestion-usuarios__campo">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gestion-usuarios__campo">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gestion-usuarios__campo">
          <label htmlFor="first_name">Nombre</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gestion-usuarios__campo">
          <label htmlFor="last_name">Apellido</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gestion-usuarios__campo">
          <label htmlFor="role_id">Rol</label>
          <select
            id="role_id"
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Crear usuario"}
        </button>
      </form>

      <table className="gestion-usuarios__tabla">
        <thead>
          <tr>
            <th>Username</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>Cargando...</td>
            </tr>
          ) : usuarios.length === 0 ? (
            <tr>
              <td colSpan={4}>No hay usuarios cargados</td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{nombreRol(u.role_id)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GestionUsuarios;