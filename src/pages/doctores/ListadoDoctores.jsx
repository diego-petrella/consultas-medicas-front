import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./ListadoDoctores.css";

export default function ListadoDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;

    async function cargarDoctores() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/doctores");
        if (!cancelado) setDoctores(data);
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar los doctores.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarDoctores();
    return () => {
      cancelado = true;
    };
  }, []);

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que querés eliminar este doctor?");
    if (!confirmar) return;

    try {
      await api.delete(`/doctores/${id}`);
      setDoctores((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.message || "Ocurrió un error al eliminar el doctor.");
    }
  }

  return (
    <div className="doctores-page">
      <div className="doctores-header">
        <h1 className="doctores-title">Doctores</h1>
        <button type="button" className="doctores-add-btn" onClick={() => navigate("/doctores/nuevo")}>
          Agregar Doctor
        </button>
      </div>

      {loading && <p className="doctores-msg">Cargando doctores...</p>}
      {!loading && error && <p className="doctores-msg doctores-msg--error">{error}</p>}

      {!loading && !error && (
        <div className="doctores-table-wrapper">
          <table className="doctores-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th className="doctores-th--actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {doctores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="doctores-empty">
                    No hay doctores registrados.
                  </td>
                </tr>
              ) : (
                doctores.map((d) => (
                  <tr key={d.id}>
                    <td>{d.matricula}</td>
                    <td>{d.nombre} {d.apellido}</td>
                    <td>{d.especialidad || "Sin especialidad"}</td>
                    <td>{d.telefono || "-"}</td>
                    <td className="doctores-td--actions">
                      <button
                        type="button"
                        className="doctores-action-btn"
                        onClick={() => navigate(`/doctores/editar/${d.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="doctores-action-btn doctores-action-btn--danger"
                        onClick={() => handleEliminar(d.id)}
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
