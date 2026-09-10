import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./ListadoVisitas.module.css";

export default function ListadoVisitas() {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    dni: "",
    fecha: "",
    obraSocial: "",
  });

  const [obrasSociales, setObrasSociales] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarObrasSociales() {
      try {
        const data = await api.get("/obras-sociales/activas");
        setObrasSociales(data);
      } catch (err) {
        console.error("Error al cargar obras sociales:", err);
      }
    }
    cargarObrasSociales();
  }, []);

  async function fetchVisitas(params = {}) {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (params.dni) query.append("dni", params.dni);
      if (params.fecha) query.append("fecha", params.fecha);
      if (params.obraSocial) query.append("obra_social_id", params.obraSocial);

      const url = `/visitas${query.toString() ? `?${query.toString()}` : ""}`;
      const data = await api.get(url);
      setVisitas(data);
    } catch (err) {
      setError(err.message || "Error al cargar visitas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVisitas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "dni") {
      setFiltros((prev) => ({ ...prev, dni: value.replace(/\D/g, "") }));
    } else {
      setFiltros((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleFiltrar() {
    fetchVisitas(filtros);
  }

  function handleLimpiar() {
    setFiltros({ dni: "", fecha: "", obraSocial: "" });
    fetchVisitas();
  }

  async function handleBorrar(id) {
    if (!window.confirm("¿Estás seguro de que quieres borrar esta visita?")) return;

    try {
      await api.delete(`/visitas/${id}`);
      fetchVisitas(filtros);
    } catch (err) {
      alert(err.message || "Error al borrar la visita");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listado de Visitas</h2>

      <div className={styles.filters}>
        <input
          type="text"
          name="dni"
          placeholder="DNI (solo números)"
          value={filtros.dni}
          onChange={handleChange}
          className={styles.input}
        />
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleChange} className={styles.input} />
        <select name="obraSocial" value={filtros.obraSocial} onChange={handleChange} className={styles.select}>
          <option value="">Todas las obras sociales</option>
          {obrasSociales.map((os) => (
            <option key={os.id} value={os.id}>
              {os.nombre}
            </option>
          ))}
        </select>

        <button onClick={handleFiltrar} className={styles.buttonPrimary}>
          Filtrar
        </button>
        <button onClick={handleLimpiar} className={styles.buttonSecondary}>
          Limpiar
        </button>
        <button onClick={() => navigate("/visitas/nueva")} className={styles.buttonNueva}>
          + Nueva Visita
        </button>
      </div>

      {error && <p className={styles.emptyMessage}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>Cargando visitas...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Obra Social</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyMessage}>
                    No hay visitas para mostrar
                  </td>
                </tr>
              ) : (
                visitas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.pacienteDni}</td>
                    <td>
                      {v.pacienteNombre} {v.pacienteApellido}
                    </td>
                    <td>
                      {v.doctorNombre} {v.doctorApellido}
                    </td>
                    <td>{v.obraSocialNombre || "Sin obra social"}</td>
                    <td>{v.fecha}</td>
                    <td className={styles.actionsCell}>
                      <button className={styles.actionButtonVer} onClick={() => navigate(`/pacientes/${v.pacienteId}`)}>
                        Ver paciente
                      </button>
                      <button className={styles.actionButtonEdit} onClick={() => navigate(`/visitas/editar/${v.id}`)}>
                        Editar
                      </button>
                      <button className={styles.actionButtonDelete} onClick={() => handleBorrar(v.id)}>
                        Borrar
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
