import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./ModalDetalleVisita.css";

function formatearJson(valor) {
  if (!valor) return "-";
  try {
    return JSON.stringify(JSON.parse(valor), null, 2);
  } catch {
    return valor;
  }
}

const ACCION_LABEL = {
  actualizacion: "Actualización",
  baja: "Baja",
};

export default function ModalDetalleVisita({ visitaId, onCerrar }) {
  const navigate = useNavigate();

  const [visita, setVisita] = useState(null);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setLoading(true);
      setError("");
      try {
        const [visitaData, logData] = await Promise.all([
          api.get(`/visitas/${visitaId}`),
          api.get(`/visitas/${visitaId}/log`).catch(() => []),
        ]);
        if (!cancelado) {
          setVisita(visitaData);
          setLog(logData || []);
        }
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar la visita.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [visitaId]);

  function irAPaciente() {
    if (visita) navigate(`/pacientes/${visita.pacienteId}`);
  }

  return (
    <div className="modal-detalle-visita-overlay" onClick={onCerrar}>
      <div className="modal-detalle-visita-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-detalle-visita-title">Detalle de Visita</h2>

        {loading && <p className="modal-detalle-visita-msg">Cargando...</p>}
        {!loading && error && <p className="modal-detalle-visita-msg modal-detalle-visita-msg--error">{error}</p>}

        {!loading && !error && visita && (
          <>
            <div className="modal-detalle-visita-field">
              <span className="modal-detalle-visita-label">Fecha</span>
              <span>{visita.fecha}</span>
            </div>

            <div className="modal-detalle-visita-field">
              <span className="modal-detalle-visita-label">Paciente</span>
              <span>{visita.pacienteNombre} {visita.pacienteApellido} (DNI {visita.pacienteDni})</span>
            </div>

            <div className="modal-detalle-visita-field">
              <span className="modal-detalle-visita-label">Doctor</span>
              <span>{visita.doctorNombre} {visita.doctorApellido}</span>
            </div>

            <div className="modal-detalle-visita-field">
              <span className="modal-detalle-visita-label">Obra Social</span>
              <span>{visita.obraSocialNombre || "Sin obra social"}</span>
            </div>

            <div className="modal-detalle-visita-field">
              <span className="modal-detalle-visita-label">Estado</span>
              <span>{visita.estado === 1 ? "Activa" : "Inactiva"}</span>
            </div>

            <div className="modal-detalle-visita-actions">
              <button type="button" className="modal-detalle-visita-btn" onClick={irAPaciente}>
                Ir a paciente
              </button>
              <button
                type="button"
                className="modal-detalle-visita-btn modal-detalle-visita-btn--secundario"
                onClick={onCerrar}
              >
                Cerrar
              </button>
            </div>

            <div className="modal-detalle-visita-log">
              <h3 className="modal-detalle-visita-subtitle">Historial de cambios</h3>
              {log.length === 0 ? (
                <p className="modal-detalle-visita-msg">Sin cambios registrados.</p>
              ) : (
                <ul className="modal-detalle-visita-log-list">
                  {log.map((entry) => (
                    <li key={entry.id} className="modal-detalle-visita-log-item">
                      <div className="modal-detalle-visita-log-header">
                        <span className="modal-detalle-visita-log-accion">
                          {ACCION_LABEL[entry.accion] || entry.accion}
                        </span>
                        <span className="modal-detalle-visita-log-fecha">{entry.created_at}</span>
                      </div>
                      <div className="modal-detalle-visita-log-diff">
                        <div>
                          <span className="modal-detalle-visita-label">Antes</span>
                          <pre className="modal-detalle-visita-log-json">{formatearJson(entry.datos_anteriores)}</pre>
                        </div>
                        <div>
                          <span className="modal-detalle-visita-label">Después</span>
                          <pre className="modal-detalle-visita-log-json">{formatearJson(entry.datos_nuevos)}</pre>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
