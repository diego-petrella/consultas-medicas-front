import { useState } from "react";
import { api } from "../../services/api";
import "./FormularioObraSocial.css";

export default function FormularioObraSocial({ obraSocial, onGuardado, onCancelar }) {
  const [nombre, setNombre] = useState(obraSocial?.nombre ?? "");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const esEdicion = Boolean(obraSocial);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setGuardando(true);
    try {
      const guardada = esEdicion
        ? await api.put(`/obras-sociales/${obraSocial.id}`, { nombre })
        : await api.post("/obras-sociales", { nombre });
      onGuardado(guardada);
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar la obra social.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-obra-social" onSubmit={handleSubmit}>
      <div className="formulario-obra-social-field">
        <label className="formulario-obra-social-label" htmlFor="nombre-obra-social">
          Nombre
        </label>
        <input
          id="nombre-obra-social"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="formulario-obra-social-input"
          autoFocus
        />
      </div>

      {error && <p className="formulario-obra-social-error">{error}</p>}

      <div className="formulario-obra-social-actions">
        <button type="submit" className="formulario-obra-social-btn" disabled={guardando}>
          {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          className="formulario-obra-social-btn formulario-obra-social-btn--secundario"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
