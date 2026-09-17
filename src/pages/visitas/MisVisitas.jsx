import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./MisVisitas.module.css";

export default function MisVisitas() {
  const navigate = useNavigate();

  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVisitas() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/visitas/mias");
        setVisitas(data);
      } catch (err) {
        setError(err.message || "Error al cargar visitas.");
      } finally {
        setLoading(false);
      }
    }
    fetchVisitas();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Visitas</h2>

      {error && <p className={styles.emptyMessage}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>Cargando visitas...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Obra Social</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.emptyMessage}>
                    No tenés visitas asignadas
                  </td>
                </tr>
              ) : (
                visitas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.fecha}</td>
                    <td>
                      {v.pacienteNombre} {v.pacienteApellido} ({v.pacienteDni})
                    </td>
                    <td>{v.obraSocialNombre || "Sin obra social"}</td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.actionButtonAtender}
                        onClick={() => navigate(`/atencion/${v.pacienteId}/${v.id}`)}
                      >
                        Atender
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
