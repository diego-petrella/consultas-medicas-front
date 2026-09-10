import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./FormularioDoctor.css";

export default function FormularioDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [matricula, setMatricula] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!esEdicion) return;

    let cancelado = false;

    async function cargarDoctor() {
      setCargando(true);
      try {
        const doctores = await api.get("/doctores");
        const doctor = doctores.find((d) => String(d.id) === id);
        if (!doctor) throw new Error("No se encontró el doctor.");
        if (!cancelado) {
          setUsername(doctor.username);
          setNombre(doctor.nombre);
          setApellido(doctor.apellido);
          setMatricula(doctor.matricula);
          setEspecialidad(doctor.especialidad || "");
          setTelefono(doctor.telefono || "");
        }
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar el doctor.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarDoctor();
    return () => {
      cancelado = true;
    };
  }, [id, esEdicion]);

  const disabled =
    guardando ||
    !nombre.trim() ||
    !apellido.trim() ||
    (!esEdicion && (!username.trim() || !password.trim() || !matricula.trim()));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      if (esEdicion) {
        await api.put(`/doctores/${id}`, {
          nombre,
          apellido,
          especialidad: especialidad.trim() || undefined,
          telefono: telefono.trim() || undefined,
        });
      } else {
        await api.post("/doctores", {
          username,
          password,
          nombre,
          apellido,
          matricula,
          especialidad: especialidad.trim() || undefined,
          telefono: telefono.trim() || undefined,
        });
      }
      navigate("/doctores");
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el doctor.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="formulario-doctor-page">
      <h1 className="formulario-doctor-title">{esEdicion ? "Editar Doctor" : "Nuevo Doctor"}</h1>

      {cargando ? (
        <p className="formulario-doctor-msg">Cargando doctor...</p>
      ) : (
        <form className="formulario-doctor" onSubmit={handleSubmit}>
          {!esEdicion && (
            <>
              <div className="formulario-doctor-field">
                <label className="formulario-doctor-label" htmlFor="username">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="formulario-doctor-input"
                />
              </div>

              <div className="formulario-doctor-field">
                <label className="formulario-doctor-label" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="formulario-doctor-input"
                />
              </div>

              <div className="formulario-doctor-field">
                <label className="formulario-doctor-label" htmlFor="matricula">
                  Matrícula
                </label>
                <input
                  id="matricula"
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="formulario-doctor-input"
                />
              </div>
            </>
          )}

          {esEdicion && (
            <div className="formulario-doctor-field">
              <label className="formulario-doctor-label">Usuario / Matrícula</label>
              <span className="formulario-doctor-readonly">
                {username} · {matricula}
              </span>
            </div>
          )}

          <div className="formulario-doctor-field">
            <label className="formulario-doctor-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="formulario-doctor-input"
            />
          </div>

          <div className="formulario-doctor-field">
            <label className="formulario-doctor-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="formulario-doctor-input"
            />
          </div>

          <div className="formulario-doctor-field">
            <label className="formulario-doctor-label" htmlFor="especialidad">
              Especialidad
            </label>
            <input
              id="especialidad"
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="formulario-doctor-input"
            />
          </div>

          <div className="formulario-doctor-field">
            <label className="formulario-doctor-label" htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="formulario-doctor-input"
            />
          </div>

          {error && <p className="formulario-doctor-error">{error}</p>}

          <div className="formulario-doctor-actions">
            <button type="submit" className="formulario-doctor-btn" disabled={disabled}>
              {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              className="formulario-doctor-btn formulario-doctor-btn--secundario"
              onClick={() => navigate("/doctores")}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
