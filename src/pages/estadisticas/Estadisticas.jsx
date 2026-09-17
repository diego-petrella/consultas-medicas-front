import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./Estadisticas.css";

export default function Estadisticas() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarStats() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/stats/dashboard");
        if (!cancelado) setStats(data);
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar las estadísticas.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarStats();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="estadisticas-page">
      <h1 className="estadisticas-title">Estadísticas</h1>

      {loading && <p className="estadisticas-msg">Cargando estadísticas...</p>}
      {!loading && error && <p className="estadisticas-msg estadisticas-msg--error">{error}</p>}

      {!loading && !error && stats && (
        <>
          <div className="estadisticas-cards">
            <div className="estadisticas-card">
              <div className="estadisticas-card-valor">{stats.totalPacientesActivos}</div>
              <div className="estadisticas-card-label">Pacientes activos</div>
            </div>
            <div className="estadisticas-card">
              <div className="estadisticas-card-valor">{stats.visitasEsteMes}</div>
              <div className="estadisticas-card-label">Visitas este mes</div>
            </div>
            <div className="estadisticas-card">
              <div className="estadisticas-card-valor">{stats.pacientesNuevosEsteMes}</div>
              <div className="estadisticas-card-label">Pacientes nuevos este mes</div>
            </div>
          </div>

          <div className="estadisticas-grid">
            <section className="estadisticas-panel">
              <h2 className="estadisticas-panel-title">Visitas por mes</h2>
              {stats.visitasPorMes.length === 0 ? (
                <p className="estadisticas-empty">Sin datos.</p>
              ) : (
                <ol className="estadisticas-lista">
                  {stats.visitasPorMes.map((item) => (
                    <li key={item.mes} className="estadisticas-item">
                      <span>{item.mes}</span>
                      <span className="estadisticas-item-cantidad">{item.cantidad}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="estadisticas-panel">
              <h2 className="estadisticas-panel-title">Visitas por obra social</h2>
              {stats.visitasPorObraSocial.length === 0 ? (
                <p className="estadisticas-empty">Sin datos.</p>
              ) : (
                <ol className="estadisticas-lista">
                  {stats.visitasPorObraSocial.map((item, idx) => (
                    <li key={idx} className="estadisticas-item">
                      <span>{item.obraSocial}</span>
                      <span className="estadisticas-item-cantidad">{item.cantidad}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="estadisticas-panel">
              <h2 className="estadisticas-panel-title">Visitas por doctor</h2>
              {stats.visitasPorDoctor.length === 0 ? (
                <p className="estadisticas-empty">Sin datos.</p>
              ) : (
                <ol className="estadisticas-lista">
                  {stats.visitasPorDoctor.map((item, idx) => (
                    <li key={idx} className="estadisticas-item">
                      <span>
                        {item.doctorNombre} {item.doctorApellido}
                      </span>
                      <span className="estadisticas-item-cantidad">{item.cantidad}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
