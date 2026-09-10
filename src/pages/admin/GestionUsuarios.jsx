import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./GestionUsuarios.css";

const FORM_VACIO = { username: "", password: "", nombre: "", apellido: "", role_id: "" };

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState("");

  const esEdicion = Boolean(usuarioEnEdicion);

  async function cargarDatos() {
    setLoading(true);
    setError("");
    try {
      const [usuariosData, rolesData] = await Promise.all([api.get("/users"), api.get("/roles")]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function nombreRol(roleId) {
    return roles.find((r) => r.id === roleId)?.nombre || roleId;
  }

  function handleAgregar() {
    setUsuarioEnEdicion(null);
    setForm(FORM_VACIO);
    setErrorForm("");
    setMostrarFormulario(true);
  }

  function handleEditar(usuario) {
    setUsuarioEnEdicion(usuario);
    setForm({
      username: usuario.username,
      password: "",
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      role_id: usuario.roleId,
    });
    setErrorForm("");
    setMostrarFormulario(true);
  }

  function handleCancelar() {
    setMostrarFormulario(false);
    setUsuarioEnEdicion(null);
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que querés eliminar este usuario?");
    if (!confirmar) return;

    try {
      await api.delete(`/users/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "Ocurrió un error al eliminar el usuario.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorForm("");

    if (!form.nombre.trim() || !form.apellido.trim() || !form.role_id) {
      setErrorForm("Nombre, apellido y rol son obligatorios.");
      return;
    }
    if (!esEdicion && (!form.username.trim() || !form.password.trim())) {
      setErrorForm("Usuario y contraseña son obligatorios.");
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion) {
        await api.put(`/users/${usuarioEnEdicion.id}`, {
          nombre: form.nombre,
          apellido: form.apellido,
          role_id: Number(form.role_id),
          password: form.password.trim() || undefined,
        });
      } else {
        await api.post("/users", {
          username: form.username,
          password: form.password,
          nombre: form.nombre,
          apellido: form.apellido,
          role_id: Number(form.role_id),
        });
      }
      setMostrarFormulario(false);
      setUsuarioEnEdicion(null);
      cargarDatos();
    } catch (err) {
      setErrorForm(err.message || "Ocurrió un error al guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <h1 className="usuarios-title">Usuarios</h1>
        <button type="button" className="usuarios-add-btn" onClick={handleAgregar}>
          Agregar Usuario
        </button>
      </div>

      {mostrarFormulario && (
        <form className="formulario-usuario" onSubmit={handleSubmit}>
          {!esEdicion && (
            <div className="formulario-usuario-field">
              <label className="formulario-usuario-label" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className="formulario-usuario-input"
              />
            </div>
          )}

          <div className="formulario-usuario-field">
            <label className="formulario-usuario-label" htmlFor="password">
              {esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="formulario-usuario-input"
            />
          </div>

          <div className="formulario-usuario-field">
            <label className="formulario-usuario-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="formulario-usuario-input"
            />
          </div>

          <div className="formulario-usuario-field">
            <label className="formulario-usuario-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              value={form.apellido}
              onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
              className="formulario-usuario-input"
            />
          </div>

          <div className="formulario-usuario-field">
            <label className="formulario-usuario-label" htmlFor="role_id">
              Rol
            </label>
            <select
              id="role_id"
              value={form.role_id}
              onChange={(e) => setForm((f) => ({ ...f, role_id: e.target.value }))}
              className="formulario-usuario-input"
            >
              <option value="">Seleccionar...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {errorForm && <p className="formulario-usuario-error">{errorForm}</p>}

          <div className="formulario-usuario-actions">
            <button type="submit" className="formulario-usuario-btn" disabled={guardando}>
              {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              className="formulario-usuario-btn formulario-usuario-btn--secundario"
              onClick={handleCancelar}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading && <p className="usuarios-msg">Cargando usuarios...</p>}
      {!loading && error && <p className="usuarios-msg usuarios-msg--error">{error}</p>}

      {!loading && !error && (
        <div className="usuarios-table-wrapper">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th className="usuarios-th--actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="usuarios-empty">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.nombre} {u.apellido}</td>
                    <td>{nombreRol(u.roleId)}</td>
                    <td className="usuarios-td--actions">
                      <button type="button" className="usuarios-action-btn" onClick={() => handleEditar(u)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="usuarios-action-btn usuarios-action-btn--danger"
                        onClick={() => handleEliminar(u.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
