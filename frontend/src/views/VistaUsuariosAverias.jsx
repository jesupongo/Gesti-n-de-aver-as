import React, { useState, useEffect } from 'react';

export function VistaUsuariosAverias({ navegar, rolUsuario }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  useEffect(() => {
    fetch('/user')
      .then(res => res.json())
      .then(data => {
        setUsuarios(data.map(u => ({
          id: u.id,
          nombre: u.nombre,
          rol: u.rol === 'ADMINISTRADOR' ? 'Administrador' : u.rol === 'MANTENIMIENTO' ? 'Técnico' : 'Personal',
          correo: u.email,
          averiasComunicadas: (u.averiasReportadas || []).map(a => ({
            id: a.id,
            titulo: a.nombre,
            estado: a.estado.toLowerCase().replace(/_/g, '-'),
            fecha: new Date(a.fecha_comunica).toLocaleDateString()
          }))
        })));
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const manejarEliminarUsuario = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      fetch(`/user/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar usuario');
          setUsuarios(prev => prev.filter(u => u.id !== id));
          alert('Usuario eliminado con éxito');
        })
        .catch(err => alert(err.message));
    }
  };

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

  
  if (mostrarModalEditar && usuarioEdicion) {
    return (
      <section className="seccion-vista active">
        <div className="tarjeta">
          <div className="cabecera-vista">
            <button className="boton-volver" onClick={() => setMostrarModalEditar(false)}>
              <span className="icon-arrow-left2"></span> Volver al Listado
            </button>
          </div>
          <h2 className="titulo-modal">Modificar Perfil de {usuarioEdicion.nombre}</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
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
              setUsuarios(prev => prev.map(u => u.id === usuarioEdicion.id ? { ...u, nombre: nombreModal } : u));
              setMostrarModalEditar(false);
            })
            .catch(err => alert(err.message));
          }}>
            <div className="grupo-formulario">
              <label className="etiqueta-formulario">Nombre de Usuario</label>
              <input className="control-formulario" value={nombreModal} onChange={(e) => setNombreModal(e.target.value)} required />
            </div>
            <div className="grupo-formulario">
              <label className="etiqueta-formulario">Nueva Contraseña</label>
              <input className="control-formulario" type="password" value={passModal} onChange={(e) => setPassModal(e.target.value)} placeholder="Dejar en blanco para omitir" />
            </div>
            <div className="botones-modal-contenedor">
              <button type="button" className="boton boton-secundario boton-modal" onClick={() => setMostrarModalEditar(false)}>Cancelar</button>
              <button type="submit" className="boton boton-principal boton-modal">Aplicar</button>
            </div>
          </form>
        </div>
      </section>
    );
  }

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
        
        <style dangerouslySetInnerHTML={{__html: `
          /* FORZANDO PADDING BUSCADOR */
          .caja-busqueda input.control-formulario {
             padding-left: 65px !important;
          }
          
          @media (max-width: 768px) {
            .cabecera-nombre-usuario {
               display: flex !important;
               flex-flow: row nowrap !important;
               align-items: center !important;
               justify-content: flex-start !important;
               gap: 0.4rem !important;
               width: 100% !important;
               margin-bottom: 0.5rem !important;
            }
            .cabecera-nombre-usuario h3.nombre-usuario {
               flex: 1 1 auto !important;
               min-width: 0 !important;
               white-space: nowrap !important;
               overflow: hidden !important;
               text-overflow: ellipsis !important;
               font-size: 0.95rem !important;
               margin: 0 !important;
               color: #002b2b !important;
               text-align: left !important;
            }
            .contenedor-botones-usuario-movil {
               display: flex !important;
               flex-direction: row !important;
               flex-wrap: nowrap !important;
               gap: 0.3rem !important;
               flex: 0 0 auto !important;
               margin-left: auto !important;
            }
            .cabecera-nombre-usuario button {
               padding: 4px 8px !important;
               font-size: 10px !important;
               font-weight: bold !important;
               letter-spacing: 0.5px !important;
               margin: 0 !important;
               height: 28px !important;
               width: auto !important;
               min-width: 60px !important;
               border-radius: 6px !important;
               text-transform: uppercase !important;
            }
            .boton-modificar-usuario {
               border: 1px solid #E1E5F2 !important;
               background: white !important;
               color: #002b2b !important;
            }
            .boton-eliminar-usuario {
               background: #ef476f !important;
               color: white !important;
               border: none !important;
            }
          }
        `}} />
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
          <button 
            onClick={() => navegar('crear-usuario')} 
            className="boton boton-secundario boton-crear-usuario-cabecera"
          >
            + Crear Usuario
          </button>
        </div>
          
          <div className="caja-busqueda caja-busqueda-margin" style={{ position: 'relative', width: '100%' }}>
            <span className="icon-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#002b2b', opacity: 0.8, fontSize: '1.4rem', zIndex: 999 }}></span>
            <input 
              type="text"
              onChange={manejarCambioBusqueda}
              className="control-formulario" 
              placeholder="Buscar por nombre o email..." 
              value={terminoBusqueda} 
              style={{ paddingLeft: '65px', width: '100%' }}
            />
          </div>

         <div className="lista-usuarios">
          {usuariosFiltrados.length > 0 ? usuariosFiltrados.map(usuario => (
            <div key={usuario.id} className="tarjeta-averia tarjeta-usuario">
              <div className="cabecera-averia cabecera-usuario">
                <div>
                  <div className="cabecera-nombre-usuario">
                    <h3 className="titulo-averia nombre-usuario">
                      {usuario.nombre}
                    </h3>
                    {usuario.correo !== 'invitado@sistema.com' && (
                      <div className="contenedor-botones-usuario-movil">
                        <button className="boton-modificar-usuario" 
                          onClick={() => {
                            setUsuarioEdicion(usuario);
                            setNombreModal(usuario.nombre);
                            setPassModal('');
                            setMostrarModalEditar(true);
                        }}>
                          EDITAR
                        </button>
                        <button className="boton-eliminar-usuario" 
                          onClick={() => manejarEliminarUsuario(usuario.id)}>
                          BORRAR
                        </button>
                      </div>
                    )}
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
    </section>
  );
}
