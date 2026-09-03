import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const disabled = !username.trim() || !password.trim() || loading;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Usuario o contraseña incorrectos.");
      }

      const datos = await response.json();
      login(datos);

      navigate(datos.role_id === 1 ? "/visitas" : "/pacientes");
    } catch (err) {
      setError(err.message || "Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <aside className="login-brand">
        <div className="login-brand-mark">Consultas Médicas</div>

        <div className="login-brand-copy">
          <h1 className="login-brand-heading">
            La historia clínica de tus pacientes, siempre a mano.
          </h1>
          <p className="login-brand-sub">
            Turnos, visitas y seguimiento en un solo lugar, pensado para el
            ritmo real de un consultorio.
          </p>
        </div>

        <div className="login-brand-foot">Sistema interno — uso exclusivo del personal</div>
      </aside>

      <div className="login-form-side">
        <form className="login-form-box" onSubmit={handleSubmit}>
          <h2 className="login-form-title">Ingresá a tu cuenta</h2>
          <p className="login-form-hint">Usá tus credenciales del consultorio.</p>

          <div className="login-field">
            <label className="login-label" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={disabled} className="login-submit">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}