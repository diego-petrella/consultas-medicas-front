import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './FormularioVisita.module.css';

const FormularioVisita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [formData, setFormData] = useState({
    dni: '', nombre: '', apellido: '', obraSocial: '', doctor: '', fechaHora: ''
  });
  const [obrasSociales, setObrasSociales] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [camposBloqueados, setCamposBloqueados] = useState(false);
  const [mensajePaciente, setMensajePaciente] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarSelects = async () => {
      try {
        const [resOS, resDoc] = await Promise.all([
          fetch('/api/obras-sociales/activas'),
          fetch('/api/doctores/activos')
        ]);
        if (resOS.ok) setObrasSociales(await resOS.json());
        if (resDoc.ok) setDoctores(await resDoc.json());
      } catch (error) {
        console.error('Error cargando selects:', error);
      }
    };
    cargarSelects();
  }, []);

  useEffect(() => {
    if (esEdicion) {
      const cargarVisita = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/visitas/${id}`);
          if (!response.ok) throw new Error('Error al cargar la visita');
          const data = await response.json();
          setFormData({
            dni: data.dni,
            nombre: data.nombre,
            apellido: data.apellido,
            obraSocial: data.obraSocial,
            doctor: data.doctor,
            fechaHora: data.fechaHora
          });
          setCamposBloqueados(true);
          setMensajePaciente({ texto: 'Paciente encontrado', tipo: 'exito' });
        } catch (error) {
          console.error('Error cargando visita:', error);
          alert('No se pudo cargar la visita.');
        } finally {
          setLoading(false);
        }
      };
      cargarVisita();
    }
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPaciente = async () => {
    if (!formData.dni) return;
    try {
      const response = await fetch(`/api/pacientes/buscar?dni=${formData.dni}`);
      if (response.ok) {
        const paciente = await response.json();
        setFormData(prev => ({
          ...prev,
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          obraSocial: paciente.obraSocial
        }));
        setCamposBloqueados(true);
        setMensajePaciente({ texto: 'Paciente encontrado', tipo: 'exito' });
      } else if (response.status === 404) {
        setFormData(prev => ({ ...prev, nombre: '', apellido: '', obraSocial: '' }));
        setCamposBloqueados(false);
        setMensajePaciente({ texto: 'Paciente nuevo', tipo: 'info' });
      }
    } catch (error) {
      console.error('Error buscando paciente:', error);
    }
  };

  const esValido = formData.dni && formData.nombre && formData.apellido && 
                   formData.obraSocial && formData.doctor && formData.fechaHora;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esValido) return;
    setLoading(true);
    try {
      const url = esEdicion ? `/api/visitas/${id}` : '/api/visitas';
      const method = esEdicion ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if ((esEdicion && response.status === 200) || (!esEdicion && response.status === 201)) {
        navigate('/visitas');
      } else {
        throw new Error('Error al guardar la visita');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{esEdicion ? 'Editar Visita' : 'Nueva Visita'}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        
        {mensajePaciente.texto && (
          <div className={`${styles.mensaje} ${styles[mensajePaciente.tipo]}`}>
            {mensajePaciente.texto}
          </div>
        )}

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
              {obrasSociales.map(os => (
                <option key={os.id} value={os.id}>{os.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={styles.label}>Doctor</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Seleccione...</option>
              {doctores.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.nombre}</option>
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
          <button type="button" onClick={() => navigate('/visitas')} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.saveBtn}
            disabled={!esValido || loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVisita;