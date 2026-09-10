import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./FormularioVisita.module.css";

function aFechaInput(fecha) {
  if (!fecha) return "";
  return fecha.replace(" ", "T").slice(0, 16);
}

function aFechaBackend(fechaInput) {
  return fechaInput.replace("T", " ") + ":00";
}

export default function FormularioVisita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    obraSocial: "",
    doctor: "",
    fechaHora: "",
  });
  const [obrasSociales, setObrasSociales] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [camposBloqueados, setCamposBloqueados] = useState(false);
  const [mensajePaciente, setMensajePaciente] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarSelects() {
      try {
        const [os, docs] = await Promise.all([
          api.get("/obras-sociales/activas"),
          api.get("/doctores/activos"),
        ]);
        setObrasSociales(os);
        setDoctores(docs);
      } catch (err) {
        console.error("Error cargando selects:", err);
      }
    }
    cargarSelects();
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    async function cargarVisita() {
      setLoading(true);
      try {
        const data = await api.get(`/visitas/${id}`);
        setFormData({
          dni: data.pacienteDni,
          nombre: data.pacienteNombre,
          apellido: data.pacienteApellido,
          obraSocial: data.obraSocialId ?? "",
          doctor: data.doctorId,
          fechaHora: aFechaInput(data.fecha),
        });
        setCamposBloqueados(true);
        setMensajePaciente({ texto: "Paciente encontrado", tipo: "exito" });
      } catch (err) {
        setError(err.message || "No se pudo cargar la visita.");
      } finally {
        setLoading(false);
      }
    }
    cargarVisita();
  }, [id, esEdicion]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleBuscarPaciente() {
    if (!formData.dni) return;
    try {
      const data = await api.get(`/pacientes/buscar?dni=${encodeURIComponent(formData.dni)}`);
      if (data.encontrado) {
        setFormData((prev) => ({
          ...prev,
          nombre: data.paciente.nombre,
          apellido: data.paciente.apellido,
          obraSocial: data.paciente.obra_social_id ?? "",
        }));
        setCamposBloqueados(true);
        setMensajePaciente({ texto: "Paciente encontrado", tipo: "exito" });
      } else {
        setFormData((prev) => ({ ...prev, nombre: "", apellido: "", obraSocial: "" }));
        setCamposBloqueados(false);
        setMensajePaciente({ texto: "Paciente nuevo", tipo: "info" });
      }
    } catch (err) {
      console.error("Error buscando paciente:", err);
    }
  }

  const esValido =
    formData.dni && formData.nombre && formData.apellido && formData.doctor && formData.fechaHora;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!esValido) return;

    setError("");
    setLoading(true);
    try {
      const payload = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        doctor_id: Number(formData.doctor),
        obra_social_id: formData.obraSocial ? Number(formData.obraSocial) : undefined,
        fecha: aFechaBackend(formData.fechaHora),
      };

      if (esEdicion) {
        await api.put(`/visitas/${id}`, payload);
      } else {
        await api.post("/visitas", payload);
      }
      navigate("/visitas");
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{esEdicion ? "Editar Visita" : "Nueva Visita"}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mensajePaciente.texto && (
          <div className={`${styles.mensaje} ${styles[mensajePaciente.tipo]}`}>
            {mensajePaciente.texto}
          </div>
        )}

        {error && <div className={`${styles.mensaje} ${styles.error}`}>{error}</div>}

        <div className={styles.grid}>
          <div>
            <label className={styles.label}>DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className={styles.input}
              readOnly={esEdicion}
              disabled={esEdicion}
            />
          </div>

          {!esEdicion && (
            <div className={styles.buscarColumn}>
              <button type="button" onClick={handleBuscarPaciente} className={styles.buscarBtn}>
                Buscar
              </button>
            </div>
          )}

          <div>
            <label className={styles.label}>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={styles.input}
              readOnly={camposBloqueados}
              disabled={camposBloqueados}
            />
          </div>

          <div>
            <label className={styles.label}>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={styles.input}
              readOnly={camposBloqueados}
              disabled={camposBloqueados}
            />
          </div>

          <div>
            <label className={styles.label}>Obra Social</label>
            <select
              name="obraSocial"
              value={formData.obraSocial}
              onChange={handleChange}
              className={styles.input}
              disabled={camposBloqueados}
            >
              <option value="">Seleccione...</option>
              {obrasSociales.map((os) => (
                <option key={os.id} value={os.id}>
                  {os.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={styles.label}>Doctor</label>
            <select name="doctor" value={formData.doctor} onChange={handleChange} className={styles.input}>
              <option value="">Seleccione...</option>
              {doctores.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre} {doc.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fullWidth}>
            <label className={styles.label}>Fecha y hora</label>
            <input
              type="datetime-local"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => navigate("/visitas")} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="submit" className={styles.saveBtn} disabled={!esValido || loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
