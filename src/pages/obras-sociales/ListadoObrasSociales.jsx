import { useEffect, useState } from "react";
import { api } from "../../services/api";
import FormularioObraSocial from "./FormularioObraSocial";
import "./ListadoObrasSociales.css";

export default function ListadoObrasSociales() {
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [obraSocialEnEdicion, setObraSocialEnEdicion] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function cargarObrasSociales() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/obras-sociales");
        if (!cancelado) setObrasSociales(data);
      } catch (err) {
        if (!cancelado) setError(err.message || "Ocurrió un error al cargar las obras sociales.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargarObrasSociales();
    return () => {
      cancelado = true;
    };
  }, []);

  function handleAgregar() {
    setObraSocialEnEdicion(null);
    setMostrarFormulario(true);
  }

  function handleEditar(obraSocial) {
    setObraSocialEnEdicion(obraSocial);
    setMostrarFormulario(true);
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta obra social?");
    if (!confirmar) return;

    try {
      await api.delete(`/obras-sociales/${id}`);
      setObrasSociales((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert(err.message || "Ocurrió un error al eliminar la obra social.");
    }
  }

  function handleGuardado(obraSocialGuardada) {
    setObrasSociales((prev) => {
      const existe = prev.some((o) => o.id === obraSocialGuardada.id);
      if (existe) {
        return prev.map((o) => (o.id === obraSocialGuardada.id ? obraSocialGuardada : o));
      }
      return [...prev, obraSocialGuardada];
    });
    setMostrarFormulario(false);
    setObraSocialEnEdicion(null);
  }

  function handleCancelar() {
    setMostrarFormulario(false);
    setObraSocialEnEdicion(null);
  }

  return (
    <div className="obras-sociales-page">
      <div className="obras-sociales-header">
        <h1 className="obras-sociales-title">Obras Sociales</h1>
        <button type="button" className="obras-sociales-add-btn" onClick={handleAgregar}>
          Agregar Obra Social
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioObraSocial
          obraSocial={obraSocialEnEdicion}
          onGuardado={handleGuardado}
          onCancelar={handleCancelar}
        />
      )}

      {loading && <p className="obras-sociales-msg">Cargando obras sociales...</p>}
      {!loading && error && <p className="obras-sociales-msg obras-sociales-msg--error">{error}</p>}

      {!loading && !error && (
        <div className="obras-sociales-table-wrapper">
          <table className="obras-sociales-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="obras-sociales-th--actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obrasSociales.length === 0 ? (
                <tr>
                  <td colSpan={2} className="obras-sociales-empty">
                    No hay obras sociales registradas.
                  </td>
                </tr>
              ) : (
                obrasSociales.map((o) => (
                  <tr key={o.id}>
                    <td>{o.nombre}</td>
                    <td className="obras-sociales-td--actions">
                      <button
                        type="button"
                        className="obras-sociales-action-btn"
                        onClick={() => handleEditar(o)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="obras-sociales-action-btn obras-sociales-action-btn--danger"
                        onClick={() => handleEliminar(o.id)}
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
