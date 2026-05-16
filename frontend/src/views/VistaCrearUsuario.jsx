import React, { useState } from 'react';

export function VistaCrearUsuario({ navegar }) {
  const [cargando, setCargando] = useState(false);

  const irAdmin = () => navegar('panel-admin');

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nombre = document.getElementById('new_user_name').value;
    const email = document.getElementById('new_user_email').value;
    const rawRole = document.getElementById('new_user_role').value;
    const password = document.getElementById('new_user_password').value;

    let rol = 'PERSONAL';
    if (rawRole === 'admin') rol = 'ADMINISTRADOR';
    if (rawRole === 'tecnico') rol = 'MANTENIMIENTO';

    setCargando(true);
    fetch('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, rol, password })
    })
    .then(async res => {
      if (!res.ok) {
        if (res.status === 409) throw new Error('El correo electrónico ya está registrado');
        const errData = await res.json();
        throw new Error(errData.message || 'Error al crear usuario (recuerda: mín. 8 caracteres)');
      }
      return res.json();
    })
    .then(() => {
      setCargando(false);
      alert("¡Usuario creado con éxito!");
      navegar('panel-admin');
    })
    .catch(err => {
      setCargando(false);
      alert(err.message);
    });
  };

  return (
    <section className="seccion-vista active">
      <div className="tarjeta">
        <div className="cabecera-vista">
          <button onClick={irAdmin} className="boton-volver">
            <span className="icon-arrow-left2"></span> Volver al Panel
          </button>
        </div>

        <div className="cabecera-con-logo">
          <div className="contenedor-logo-pequeno">
            <img src="/logo-silverfish.png" alt="Logo" className="img-logo-pequeno" />
          </div>
          <div className="columna-texto-cabecera">
            <h2 className="titulo-cabecera-ajuste">Crear Nuevo Usuario</h2>
            <p className="text-light subtitulo-cabecera-ajuste">Añade técnicos, administradores o personal del centro al sistema.</p>
          </div>
        </div>

        <form onSubmit={manejarEnvio} className="mt-4">
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="new_user_name">Nombre Completo</label>
            <input type="text" id="new_user_name" className="control-formulario" placeholder="Ej: Ana Gómez" required />
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="new_user_email">Correo Electrónico</label>
            <input type="email" id="new_user_email" className="control-formulario" placeholder="Ej: ana@colegio.edu" required />
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="new_user_role">Rol del Usuario</label>
            <select id="new_user_role" className="control-formulario" defaultValue="" required>
              <option value="" disabled>Selecciona un rol...</option>
              <option value="tecnico">Técnico de Mantenimiento</option>
              <option value="admin">Administrador / Coordinador</option>
              <option value="personal">Personal del Centro (Profesor/Pas)</option>
            </select>
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="new_user_password">Contraseña Temporal</label>
            <input type="password" id="new_user_password" className="control-formulario" placeholder="••••••••" required />
          </div>

          <button type="submit" className="boton boton-principal" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar Usuario'}
          </button>
        </form>
      </div>
    </section>
  );
}
