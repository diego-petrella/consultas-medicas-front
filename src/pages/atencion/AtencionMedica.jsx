import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./AtencionMedica.css";

export default function AtencionMedica() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarPaciente() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get(`/pacientes/${pacienteId}/historial`);
        if (!cancelado) setPaciente(data.paciente);
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar el paciente.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarPaciente();
    return () => {
      cancelado = true;
    };
  }, [pacienteId]);

  const disabledGuardar = !diagnostico.trim() || !tratamiento.trim() || guardando;

  async function handleGuardar() {
    setErrorGuardar("");
    setGuardando(true);
    try {
      await api.post("/historias-clinicas", {
        paciente_id: Number(pacienteId),
        diagnostico,
        tratamiento,
        observaciones: observaciones.trim() || undefined,
      });
      navigate(`/pacientes/${pacienteId}`);
    } catch (err) {
      setErrorGuardar(err.message || "Ocurrió un error al guardar la atención.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="atencion-page">
      <h1 className="atencion-title">Nueva Atención</h1>

      {loading && <p className="atencion-msg">Cargando paciente...</p>}
      {!loading && error && <p className="atencion-msg atencion-msg--error">{error}</p>}

      {!loading && !error && paciente && (
        <>
          <div className="atencion-paciente-card">
            <div className="atencion-paciente-dato">
              <span className="atencion-paciente-label">Paciente</span>
              <span>{paciente.nombre} {paciente.apellido}</span>
            </div>
            <div className="atencion-paciente-dato">
              <span className="atencion-paciente-label">DNI</span>
              <span>{paciente.dni}</span>
            </div>
            <div className="atencion-paciente-dato">
              <span className="atencion-paciente-label">Obra Social</span>
              <span>{paciente.obra_social_nombre || "Sin obra social"}</span>
            </div>
          </div>

          <div className="atencion-form">
            <div className="atencion-field">
              <label className="atencion-label" htmlFor="diagnostico">
                Diagnóstico
              </label>
              <textarea
                id="diagnostico"
                className="atencion-textarea"
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                rows={3}
              />
            </div>

            <div className="atencion-field">
              <label className="atencion-label" htmlFor="tratamiento">
                Tratamiento
              </label>
              <textarea
                id="tratamiento"
                className="atencion-textarea"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                rows={3}
              />
            </div>

            <div className="atencion-field">
              <label className="atencion-label" htmlFor="observaciones">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                className="atencion-textarea"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
              />
            </div>

            {errorGuardar && <p className="atencion-msg atencion-msg--error">{errorGuardar}</p>}

            <button
              type="button"
              className="atencion-guardar-btn"
              onClick={handleGuardar}
              disabled={disabledGuardar}
            >
              {guardando ? "Guardando..." : "Guardar Atención"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
