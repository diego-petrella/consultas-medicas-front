import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListadoVisitas.css";

export default function ListadoVisitas() {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;

    async function cargarVisitas() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8083/api/visitas");
        if (!response.ok) throw new Error("No se pudieron cargar las visitas.");
        const data = await response.json();
        if (!cancelado) setVisitas(data);
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar las visitas.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarVisitas();
    return () => {
      cancelado = true;
    };
  }, []);

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta visita?");
    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:8080/api/visitas/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar la visita.");
      setVisitas((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err.message || "Ocurrió un error al eliminar la visita.");
    }
  }

  return (
    <div className="visitas-page">
      <h1 className="visitas-title">Visitas</h1>

      {loading && <p className="visitas-msg">Cargando visitas...</p>}
      {!loading && error && <p className="visitas-msg visitas-msg--error">{error}</p>}

      {!loading && !error && (
        <div className="visitas-table-wrapper">
          <table className="visitas-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>DNI</th>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Obra Social</th>
                <th className="visitas-th--actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="visitas-empty">
                    No hay visitas registradas.
                  </td>
                </tr>
              ) : (
                visitas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.fecha}</td>
                    <td>{v.dni}</td>
                    <td>{v.paciente}</td>
                    <td>{v.doctor}</td>
                    <td>{v.obraSocial}</td>
                    <td className="visitas-td--actions">
                      <button
                        type="button"
                        className="visitas-action-btn"
                        onClick={() => navigate(`/visitas/editar/${v.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="visitas-action-btn visitas-action-btn--danger"
                        onClick={() => handleEliminar(v.id)}
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