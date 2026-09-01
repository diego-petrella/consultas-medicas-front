import { useAuth } from './context/AuthContext.jsx'

function App() {
  const { usuario, login, logout } = useAuth()

  return (
    <div>
      {usuario ? (
        <>
          <p>Logueado como: {usuario.nombre}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ nombre: 'Andres' })}>Login</button>
      )}
    </div>
  )
}

export default App