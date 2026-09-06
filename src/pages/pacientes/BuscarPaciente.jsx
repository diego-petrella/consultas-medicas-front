import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import FormularioPaciente from "./FormularioPaciente";
import "./BuscarPaciente.css";

export default function BuscarPaciente() {
  const [dni, setDni] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");
  const [noEncontrado, setNoEncontrado] = useState(false);
  const navigate = useNavigate();

  async function handleBuscar(e) {
    e.preventDefault();
    setError("");
    setNoEncontrado(false);

    if (!dni.trim()) return;

    setBuscando(true);
    try {
      const data = await api.get(`/pacientes/buscar?dni=${encodeURIComponent(dni.trim())}`);
      if (data.encontrado) {
        navigate(`/pacientes/${data.paciente.id}`);
      } else {
        setNoEncontrado(true);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al buscar el paciente.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="buscar-paciente-page">
      <h1 className="buscar-paciente-title">Pacientes</h1>

      <form className="buscar-paciente-form" onSubmit={handleBuscar}>
        <div className="buscar-paciente-field">
          <label className="buscar-paciente-label" htmlFor="dni-busqueda">
            DNI
          </label>
          <input
            id="dni-busqueda"
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="buscar-paciente-input"
            autoFocus
          />
        </div>
        <button type="submit" className="buscar-paciente-btn" disabled={buscando}>
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <p className="buscar-paciente-msg buscar-paciente-msg--error">{error}</p>}

      {noEncontrado && (
        <div className="buscar-paciente-resultado">
          <p className="buscar-paciente-msg">
            No se encontró ningún paciente con DNI {dni}. Podés darlo de alta:
          </p>
          <FormularioPaciente
            onGuardado={(id) => navigate(`/pacientes/${id}`)}
            onCancelar={() => setNoEncontrado(false)}
          />
        </div>
      )}
    </div>
  );
}
