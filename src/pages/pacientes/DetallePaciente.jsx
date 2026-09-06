import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import ModalHistoriaClinica from "../../components/ModalHistoriaClinica";
import "./DetallePaciente.css";

export default function DetallePaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [paciente, setPaciente] = useState(null);
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null);

  const esDoctor = usuario?.role_id === 2;

  useEffect(() => {
    let cancelado = false;

    async function cargarPaciente() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get(`/pacientes/${id}/historial`);
        if (!cancelado) {
          setPaciente(data.paciente);
          setHistorias(data.historias);
        }
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
  }, [id]);

  return (
    <div className="detalle-paciente-page">
      <h1 className="detalle-paciente-title">Paciente</h1>

      {loading && <p className="detalle-paciente-msg">Cargando paciente...</p>}
      {!loading && error && <p className="detalle-paciente-msg detalle-paciente-msg--error">{error}</p>}

      {!loading && !error && paciente && (
        <>
          <div className="detalle-paciente-card">
            <div className="detalle-paciente-dato">
              <span className="detalle-paciente-label">Paciente</span>
              <span>{paciente.nombre} {paciente.apellido}</span>
            </div>
            <div className="detalle-paciente-dato">
              <span className="detalle-paciente-label">DNI</span>
              <span>{paciente.dni}</span>
            </div>
            <div className="detalle-paciente-dato">
              <span className="detalle-paciente-label">Obra Social</span>
              <span>{paciente.obra_social_nombre || "Sin obra social"}</span>
            </div>

            {esDoctor && (
              <button
                type="button"
                className="detalle-paciente-nueva-btn"
                onClick={() => navigate(`/atencion/${id}`)}
              >
                Nueva Atención
              </button>
            )}
          </div>

          <h2 className="detalle-paciente-subtitle">Historial</h2>

          {historias.length === 0 ? (
            <p className="detalle-paciente-msg">Este paciente no tiene consultas registradas.</p>
          ) : (
            <div className="detalle-paciente-table-wrapper">
              <table className="detalle-paciente-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Doctor</th>
                    <th className="detalle-paciente-th--actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historias.map((h) => (
                    <tr key={h.id}>
                      <td>{h.fecha}</td>
                      <td>{h.doctor_nombre} {h.doctor_apellido}</td>
                      <td className="detalle-paciente-td--actions">
                        <button
                          type="button"
                          className="detalle-paciente-action-btn"
                          onClick={() => setHistoriaSeleccionada(h)}
                        >
                          Ver más
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {historiaSeleccionada && (
        <ModalHistoriaClinica
          historia={historiaSeleccionada}
          onCerrar={() => setHistoriaSeleccionada(null)}
        />
      )}
    </div>
  );
}
