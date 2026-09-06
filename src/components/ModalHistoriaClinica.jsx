import "./ModalHistoriaClinica.css";

export default function ModalHistoriaClinica({ historia, onCerrar }) {
  const urlPdf = `${import.meta.env.VITE_API_URL}/historias-clinicas/${historia.id}/pdf`;

  return (
    <div className="modal-historia-overlay" onClick={onCerrar}>
      <div className="modal-historia-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-historia-title">Historia Clínica</h2>

        <div className="modal-historia-field">
          <span className="modal-historia-label">Fecha</span>
          <span>{historia.fecha}</span>
        </div>

        <div className="modal-historia-field">
          <span className="modal-historia-label">Doctor</span>
          <span>{historia.doctor_nombre} {historia.doctor_apellido}</span>
        </div>

        <div className="modal-historia-field">
          <span className="modal-historia-label">Diagnóstico</span>
          <p className="modal-historia-texto">{historia.diagnostico}</p>
        </div>

        <div className="modal-historia-field">
          <span className="modal-historia-label">Tratamiento</span>
          <p className="modal-historia-texto">{historia.tratamiento}</p>
        </div>

        <div className="modal-historia-field">
          <span className="modal-historia-label">Observaciones</span>
          <p className="modal-historia-texto">{historia.observaciones || "Sin observaciones"}</p>
        </div>

        <div className="modal-historia-actions">
          <a
            className="modal-historia-btn"
            href={urlPdf}
            target="_blank"
            rel="noreferrer"
          >
            Descargar PDF
          </a>
          <button
            type="button"
            className="modal-historia-btn modal-historia-btn--secundario"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
