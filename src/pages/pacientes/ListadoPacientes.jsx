import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import FormularioPaciente from "./FormularioPaciente";
import "./ListadoPacientes.css";

export default function ListadoPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  async function cargarPacientes() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/pacientes");
      setPacientes(data);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar los pacientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
  }, []);

  function handleAgregar() {
    setMostrarFormulario(true);
  }

  function handleCancelar() {
    setMostrarFormulario(false);
  }

  function handleGuardado() {
    setMostrarFormulario(false);
    cargarPacientes();
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que querés eliminar este paciente?");
    if (!confirmar) return;

    try {
      await api.delete(`/pacientes/${id}`);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Ocurrió un error al eliminar el paciente.");
    }
  }

  return (
    <div className="pacientes-page">
      <div className="pacientes-header">
        <h1 className="pacientes-title">Pacientes</h1>
        <button type="button" className="pacientes-add-btn" onClick={handleAgregar}>
          Agregar Paciente
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioPaciente onGuardado={handleGuardado} onCancelar={handleCancelar} />
      )}

      {loading && <p className="pacientes-msg">Cargando pacientes...</p>}
      {!loading && error && <p className="pacientes-msg pacientes-msg--error">{error}</p>}

      {!loading && !error && (
        <div className="pacientes-table-wrapper">
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Obra Social</th>
                <th className="pacientes-th--actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="pacientes-empty">
                    No hay pacientes registrados.
                  </td>
                </tr>
              ) : (
                pacientes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.dni}</td>
                    <td>{p.nombre}</td>
                    <td>{p.apellido}</td>
                    <td>{p.obra_social_nombre || "Sin obra social"}</td>
                    <td className="pacientes-td--actions">
                      <button
                        type="button"
                        className="pacientes-action-btn"
                        onClick={() => navigate(`/pacientes/${p.id}`)}
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="pacientes-action-btn pacientes-action-btn--danger"
                        onClick={() => handleEliminar(p.id)}
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
