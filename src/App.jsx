import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListadoVisitas from './pages/visitas/ListadoVisitas';
import FormularioVisita from './pages/visitas/FormularioVisita';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para ver la lista */}
        <Route path="/visitas" element={<ListadoVisitas />} />
        
        {/* Ruta para crear una nueva visita */}
        <Route path="/visitas/nueva" element={<FormularioVisita />} />
        
        {/* Ruta para editar una visita existente (captura el ID) */}
        <Route path="/visitas/editar/:id" element={<FormularioVisita />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;