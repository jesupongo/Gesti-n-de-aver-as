import React, { useState, useEffect } from 'react';

const datosUsuarios = [
  {
    id: 1,
    nombre: 'Ana Gómez',
    rol: 'Profesor',
    correo: 'ana@colegio.edu',
    averiasComunicadas: [
      { id: 101, titulo: 'Proyector no enciende', estado: 'en-reparacion', fecha: '2023-10-25' },
      { id: 102, titulo: 'Pizarra suelta', estado: 'sin-empezar', fecha: '2023-10-26' }
    ]
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    rol: 'Conserje',
    correo: 'carlos@colegio.edu',
    averiasComunicadas: [
      { id: 201, titulo: 'Grifo Gotea en baño 2', estado: 'terminada', fecha: '2023-10-20' }
    ]
  },
  {
    id: 3,
    nombre: 'Laura Martínez',
    rol: 'Profesor',
    correo: 'laura@colegio.edu',
    averiasComunicadas: []
  }
];

export function VistaUsuariosAverias({ navegar, rolUsuario }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  
  useEffect(() => {
    fetch('/user')
      .then(res => res.json())
      .then(data => {
        setUsuarios(data.map(u => ({
          id: u.id,
          nombre: u.nombre,
          rol: u.rol === 'ADMINISTRADOR' ? 'Administrador' : u.rol === 'MANTENIMIENTO' ? 'Técnico' : 'Personal',
          correo: u.email,
          averiasComunicadas: [] 
        })));
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioEdicion, setUsuarioEdicion] = useState(null);
  const [nombreModal, setNombreModal] = useState('');
  const [passModal, setPassModal] = useState('');

  const manejarNavegacionInicio = () => navegar('bienvenida');
  const manejarNavegacionAdmin = () => navegar('panel-admin');
  const manejarCambioBusqueda = (e) => setTerminoBusqueda(e.target.value);

  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) || 
    usuario.correo.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const obtenerEtiquetaEstado = (estado) => {
    switch(estado) {
      case 'sin-empezar': return 'Sin empezar';
      case 'en-reparacion': return 'En Reparación';
      case 'terminada': return 'Terminada';
      default: return estado;
    }
  };

  if (rolUsuario !== 'admin') {
    return (
      <section className="seccion-vista active">
        <div className="tarjeta">
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden ver esta página.</p>
          <button onClick={manejarNavegacionInicio} className="boton boton-principal">Volver al Inicio</button>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion-vista active seccion-amplia">
      <div className="tarjeta tarjeta-amplia">
        <div className="cabecera-vista">
          <button onClick={manejarNavegacionAdmin} className="boton-volver">
            <span className="icon-arrow-left2"></span> Volver al Panel Admin
          </button>
        </div>
        
        <div className="cabecera-panel cabecera-panel-margin">
          <div className="flex-centrado">
            <div className="contenedor-logo">
              <img src="/logo-silverfish.png" alt="Logo" className="imagen-logo" />
            </div>
            <div className="contenedor-titulo">
              <h2 className="texto-titulo">Usuarios y Averías</h2>
              <p className="text-light texto-subtitulo">Listado de usuarios y averías comunicadas</p>
            </div>
          </div>
          
          <div className="caja-busqueda">
            <span className="icon-search"></span>
            <input 
              type="text"
              onChange={manejarCambioBusqueda}
              className="control-formulario" 
              placeholder="Buscar por nombre o email..." 
              value={terminoBusqueda} 
            />
          </div>
        </div>

        <div className="lista-usuarios">
          {usuariosFiltrados.length > 0 ? usuariosFiltrados.map(usuario => (
            <div key={usuario.id} className="tarjeta-averia tarjeta-usuario">
              <div className="cabecera-averia cabecera-usuario">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '0.2rem' }}>
                    <h3 className="titulo-averia nombre-usuario" style={{ margin: 0, whiteSpace: 'nowrap' }}>{usuario.nombre}</h3>
                    <button className="boton boton-secundario" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: 0, borderRadius: 'var(--radius-md)' }} onClick={() => {
                        setUsuarioEdicion(usuario);
                        setNombreModal(usuario.nombre);
                        setPassModal('');
                        setMostrarModalEditar(true);
                    }}>MODIFICAR</button>
                  </div>
                  <div className="meta-averia">
                    <span>{usuario.rol}</span> • <span>{usuario.correo}</span>
                  </div>
                </div>
                <div className="texto-derecha">
                  <span className="contador-averias">
                    {usuario.averiasComunicadas.length} Avería{usuario.averiasComunicadas.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div>
                {usuario.averiasComunicadas.length > 0 ? (
                  <ul className="lista-averias-usuario">
                    {usuario.averiasComunicadas.map(averia => (
                      <li key={averia.id} className="item-averia-usuario">
                        <div className="info-averia-usuario">
                          <span className="titulo-averia-item">{averia.titulo}</span>
                          <span className="fecha-averia-item">{averia.fecha}</span>
                        </div>
                        <span className={`distintivo distintivo-estado distintivo-sm ${averia.estado !== 'sin-empezar' ? averia.estado : ''}`}>
                          {obtenerEtiquetaEstado(averia.estado)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-light no-averias">No ha comunicado ninguna avería.</p>
                )}
              </div>
            </div>
          )) : (
            <p className="text-light no-usuarios">No se encontraron usuarios.</p>
          )}
        </div>
      </div>

      {mostrarModalEditar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,39,40,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.3s ease forwards' }}>
          <div className="tarjeta" style={{ width: '450px', maxWidth: '90%', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Modificar Perfil de {usuarioEdicion?.nombre}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (usuarioEdicion) {
                 fetch(`/user/${usuarioEdicion.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: nombreModal, password: passModal || undefined })
                 })
                 .then(res => {
                    if (!res.ok) throw new Error('Error al actualizar usuario');
                    return res.json();
                 })
                 .then(() => {
                    const nuevosUsuarios = usuarios.map(u => u.id === usuarioEdicion.id ? { ...u, nombre: nombreModal } : u);
                    setUsuarios(nuevosUsuarios);
                    setMostrarModalEditar(false);
                 })
                 .catch(err => alert(err.message));
              }
            }}>
              <div className="grupo-formulario">
                 <label className="etiqueta-formulario">Nombre de Usuario</label>
                 <input className="control-formulario" value={nombreModal} onChange={(e) => setNombreModal(e.target.value)} required />
              </div>
              <div className="grupo-formulario">
                 <label className="etiqueta-formulario">Nueva Contraseña</label>
                 <input className="control-formulario" type="password" value={passModal} onChange={(e) => setPassModal(e.target.value)} placeholder="Dejar en blanco para omitir" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <button type="button" className="boton boton-secundario" style={{ marginTop: 0 }} onClick={() => setMostrarModalEditar(false)}>Cancelar</button>
                 <button type="submit" className="boton boton-principal" style={{ marginTop: 0 }}>Aplicar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
