import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./FormularioPaciente.css";

export default function FormularioPaciente({ paciente, onGuardado, onCancelar }) {
  const esEdicion = Boolean(paciente);

  const [dni, setDni] = useState(paciente?.dni ?? "");
  const [nombre, setNombre] = useState(paciente?.nombre ?? "");
  const [apellido, setApellido] = useState(paciente?.apellido ?? "");
  const [telefono, setTelefono] = useState(paciente?.telefono ?? "");
  const [obraSocialId, setObraSocialId] = useState(paciente?.obra_social_id ?? "");
  const [obrasSociales, setObrasSociales] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function cargarObrasSociales() {
      try {
        const data = await api.get("/obras-sociales");
        if (!cancelado) setObrasSociales(data);
      } catch {
        if (!cancelado) setError("No se pudieron cargar las obras sociales.");
      }
    }

    cargarObrasSociales();
    return () => {
      cancelado = true;
    };
  }, []);

  const disabled =
    !dni.trim() || !nombre.trim() || !apellido.trim() || !obraSocialId || guardando;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      if (esEdicion) {
        await api.put(`/pacientes/${paciente.id}`, {
          nombre,
          apellido,
          telefono: telefono.trim() || undefined,
          obra_social_id: Number(obraSocialId),
        });
        onGuardado(paciente.id);
      } else {
        const creado = await api.post("/pacientes", {
          dni,
          nombre,
          apellido,
          telefono: telefono.trim() || undefined,
          obra_social_id: Number(obraSocialId),
        });
        onGuardado(creado.id);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el paciente.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-paciente" onSubmit={handleSubmit}>
      <div className="formulario-paciente-field">
        <label className="formulario-paciente-label" htmlFor="dni-paciente">
          DNI
        </label>
        <input
          id="dni-paciente"
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="formulario-paciente-input"
          disabled={esEdicion}
          autoFocus={!esEdicion}
        />
      </div>

      <div className="formulario-paciente-field">
        <label className="formulario-paciente-label" htmlFor="nombre-paciente">
          Nombre
        </label>
        <input
          id="nombre-paciente"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="formulario-paciente-input"
        />
      </div>

      <div className="formulario-paciente-field">
        <label className="formulario-paciente-label" htmlFor="apellido-paciente">
          Apellido
        </label>
        <input
          id="apellido-paciente"
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="formulario-paciente-input"
        />
      </div>

      <div className="formulario-paciente-field">
        <label className="formulario-paciente-label" htmlFor="telefono-paciente">
          Teléfono
        </label>
        <input
          id="telefono-paciente"
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="formulario-paciente-input"
        />
      </div>

      <div className="formulario-paciente-field">
        <label className="formulario-paciente-label" htmlFor="obra-social-paciente">
          Obra Social
        </label>
        <select
          id="obra-social-paciente"
          value={obraSocialId}
          onChange={(e) => setObraSocialId(e.target.value)}
          className="formulario-paciente-input"
        >
          <option value="">Seleccionar...</option>
          {obrasSociales.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="formulario-paciente-error">{error}</p>}

      <div className="formulario-paciente-actions">
        <button type="submit" className="formulario-paciente-btn" disabled={disabled}>
          {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          className="formulario-paciente-btn formulario-paciente-btn--secundario"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
