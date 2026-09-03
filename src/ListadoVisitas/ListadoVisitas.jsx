import React, { useState, useEffect } from 'react';
import styles from './ListadoVisitas.module.css';

const ListadoVisitas = () => {

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
    const params = {
      dni: filtros.dni,
      fecha: filtros.fecha,
      obraSocial: filtros.obraSocial,
    };
    fetchVisitas(params);
  };


  const handleLimpiar = () => {
    setFiltros({
      dni: '',
      fecha: '',
      obraSocial: '',
    });
    fetchVisitas();
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
      </div>

      {loading ? (
        <p className={styles.loading}>Cargando visitas...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Fecha</th>
                <th>Obra Social</th>
                <th>Paciente</th>
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
                    <td>{visita.fecha}</td>
                    <td>{visita.obraSocial?.nombre || 'N/A'}</td>
                    <td>{visita.paciente?.nombre || 'N/A'}</td>
                    <td>
                      <button className={styles.actionButton}>Ver</button>
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