import React, { useState } from 'react';
import { VistaBienvenida } from './views/VistaBienvenida';
import { VistaAcceso } from './views/VistaAcceso';
import { VistaComunicarAveria } from './views/VistaComunicarAveria';
import { VistaAdmin } from './views/VistaAdmin';
import { VistaCrearUsuario } from './views/VistaCrearUsuario';
import { VistaUsuariosAverias } from './views/VistaUsuariosAverias';
import { VistaPersonal } from './views/VistaPersonal';

function App() {
  const [vistaActual, setVistaActual] = useState(localStorage.getItem('v') || 'bienvenida'); 
  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('r')); 
  const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem('n') || ''); 
  const [idUsuario, setIdUsuario] = useState(localStorage.getItem('u')); 

  const navegar = (viewId, push = true) => { 
    setVistaActual(viewId);
    localStorage.setItem('v', viewId);
    if (push) {
      window.history.pushState({ viewId }, '', '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const manejarCambioHistorial = (event) => {
      if (event.state && event.state.viewId) {
        setVistaActual(event.state.viewId);
      } else {
        setVistaActual('bienvenida');
      }
    };

    window.addEventListener('popstate', manejarCambioHistorial);
    
    if (!window.history.state) {
        window.history.replaceState({ viewId: 'bienvenida' }, '', '');
    }
    
    return () => window.removeEventListener('popstate', manejarCambioHistorial);
  }, []);

  React.useEffect(() => {
    if (vistaActual === 'bienvenida') {
      localStorage.removeItem('r');
      localStorage.removeItem('n');
      localStorage.removeItem('u');
      setRolUsuario(null);
      setNombreUsuario('');
      setIdUsuario(null);
    }
  }, [vistaActual]);

  const iniciarSesionComo = (rol, nombre, id) => {
    localStorage.setItem('r', rol);
    localStorage.setItem('n', nombre);
    localStorage.setItem('u', id);
    setRolUsuario(rol);
    setNombreUsuario(nombre);
    setIdUsuario(id);
    const inicial = rol === 'personal' ? 'panel-personal' : 'panel-admin';
    navegar(inicial);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('r');
    localStorage.removeItem('n');
    localStorage.removeItem('u');
    setRolUsuario(null);
    setNombreUsuario('');
    setIdUsuario(null);
    navegar('bienvenida');
  };

  return (
    <main id="app-container">
      {vistaActual === 'bienvenida' && <VistaBienvenida navegar={navegar} />}
      {vistaActual === 'acceso' && <VistaAcceso navegar={navegar} iniciarSesionComo={iniciarSesionComo} />}
      {vistaActual === 'comunicar-averia' && <VistaComunicarAveria navegar={navegar} idUsuario={idUsuario} />}
      {vistaActual === 'panel-admin' && <VistaAdmin navegar={navegar} rolUsuario={rolUsuario} nombreUsuario={nombreUsuario} idUsuario={idUsuario} actualizarPerfil={setNombreUsuario} cerrarSesion={cerrarSesion} />}
      {vistaActual === 'panel-personal' && <VistaPersonal navegar={navegar} rolUsuario={rolUsuario} nombreUsuario={nombreUsuario} idUsuario={idUsuario} actualizarPerfil={setNombreUsuario} cerrarSesion={cerrarSesion} />}
      {vistaActual === 'crear-usuario' && <VistaCrearUsuario navegar={navegar} />}
      {vistaActual === 'usuarios-averias' && <VistaUsuariosAverias navegar={navegar} rolUsuario={rolUsuario} />}
    </main>
  );
}

export default App;
