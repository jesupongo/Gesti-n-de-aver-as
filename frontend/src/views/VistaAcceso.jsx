import React, { useState } from 'react';

export function VistaAcceso({ navegar, iniciarSesionComo }) {
  const [cargando, setCargando] = useState(false);

  const irAtras = () => navegar('bienvenida');
  
  const manejarEnvio = (e) => {
    e.preventDefault();
    const email = e.target.elements.usuario?.value;
    const password = e.target.elements.password?.value;
    
    setCargando(true);
    
    fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) throw new Error('Credenciales inválidas');
      return res.json();
    })
    .then(data => {
      setCargando(false);
      // Mapear rol de DB a rol de Frontend
      let rolFrontend = 'personal';
      if (data.user.rol === 'ADMINISTRADOR') rolFrontend = 'admin';
      if (data.user.rol === 'MANTENIMIENTO') rolFrontend = 'tecnico';
      
      iniciarSesionComo(rolFrontend, data.user.nombre, data.user.id);
    })
    .catch(err => {
      setCargando(false);
      alert(err.message || 'Error al iniciar sesión');
    });
  };

  return (
    <section className="seccion-vista active">
      <div className="tarjeta">
        <div className="cabecera-vista cabecera-login-ajuste">
          <button type="button" onClick={irAtras} className="boton-volver">
            <span className="icon-arrow-left2"></span> Atrás
          </button>
        </div>
        
        <form onSubmit={manejarEnvio}>
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="usuario">Usuario o Correo</label>
            <input type="text" id="usuario" className="control-formulario" placeholder="Ej: profesor@colegio.edu" required />
          </div>
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="password">Contraseña</label>
            <input type="password" id="password" className="control-formulario" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="boton boton-principal" disabled={cargando}>
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
          

        </form>
      </div>
    </section>
  );
}
