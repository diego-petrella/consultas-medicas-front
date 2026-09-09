import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListadoVisitas.module.css';

const ListadoVisitas = () => {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    dni: '',
    fecha: '',
    obraSocial: '',
  });

  const [obrasSociales, setObrasSociales] = useState([]);

  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarObrasSociales = async () => {
      try {
        const response = await fetch('/api/obras-sociales/activas');
        if (!response.ok) throw new Error('Error al cargar obras sociales');
        const data = await response.json();
        setObrasSociales(data);
      } catch (error) {
        console.error('Error al cargar obras sociales:', error);
      }
    };
    cargarObrasSociales();
  }, []);

  const fetchVisitas = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] && params[key].trim() !== '') {
          query.append(key, params[key]);
        }
      });
      const url = `/api/visitas${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar visitas');
      const data = await response.json();
      setVisitas(data);
    } catch (error) {
      console.error('Error al cargar visitas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dni') {
      const numericValue = value.replace(/\D/g, ''); 
      setFiltros(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFiltros(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleFiltrar = () => {
    fetchVisitas(filtros);
  };

 
  const handleLimpiar = () => {
    setFiltros({ dni: '', fecha: '', obraSocial: '' });
    fetchVisitas(); 
  };


  const handleBorrar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres borrar esta visita?')) {
      try {
        const response = await fetch(`/api/visitas/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchVisitas(filtros); 
        } else {
          alert('Error al borrar la visita');
        }
      } catch (error) {
        console.error('Error al borrar:', error);
      }
    }
  };

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
          pattern="[0-9]*"
          title="Solo números"
        />
        <input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={handleChange}
          className={styles.input}
        />
        <select
          name="obraSocial"
          value={filtros.obraSocial}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Todas las obras sociales</option>
          {obrasSociales.map(os => (
            <option key={os.id} value={os.id}>{os.nombre}</option>
          ))}
        </select>

        <button onClick={handleFiltrar} className={styles.buttonPrimary}>
          Filtrar
        </button>
        <button onClick={handleLimpiar} className={styles.buttonSecondary}>
          Limpiar
        </button>

        <button 
          onClick={() => navigate('/visitas/nueva')} 
          className={styles.buttonNueva}
        >
          + Nueva Visita
        </button>
      </div>

 
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
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyMessage}>
                    No hay visitas para mostrar
                  </td>
                </tr>
              ) : (
                visitas.map(visita => (
                  <tr key={visita.id}>
                    <td>{visita.dni}</td>
                    <td>{visita.nombre} {visita.apellido}</td>
                    <td>{visita.doctor}</td>
                    <td>{visita.fechaHora}</td>
                    <td>
                      <button 
                        className={styles.actionButtonEdit} 
                        onClick={() => navigate(`/visitas/editar/${visita.id}`)}
                      >
                        <i className="fas fa-pen"></i> Editar
                      </button>
                      <button 
                        className={styles.actionButtonDelete} 
                        onClick={() => handleBorrar(visita.id)}
                      >
                        <i className="fas fa-trash"></i> Borrar
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
};

export default ListadoVisitas;