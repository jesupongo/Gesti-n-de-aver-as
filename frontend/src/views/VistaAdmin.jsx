import React, { useState, useEffect } from 'react';

export function VistaAdmin({ navegar, rolUsuario, nombreUsuario, idUsuario, actualizarPerfil, cerrarSesion }) {
  const [averias, setAverias] = useState([]);
  const [techs, setTechs] = useState([]);
  const [viewMode, setViewMode] = useState(rolUsuario === 'admin' ? 'pendientes' : 'publicadas');
  const [verMenuMovil, setVerMenuMovil] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetch('/averia')
        .then(res => res.json())
        .then(data => {
          setAverias(data.map(a => ({
            id: a.id,
            titulo: a.nombre,
            categoria: a.tipo,
            ubicacion: a.ubicacion,
            descripcion: a.descripcion,
            prioridad: a.valoracion.toLowerCase().replace(/_/g, '-'),
            estado: a.estado.toLowerCase().replace(/_/g, '-'),
            asignadoA: a.reparador ? a.reparador.id : '',
            verificada: a.verificada
          })));
        });
        
      fetch('/averia/tecnicos')
        .then(res => res.json())
        .then(setTechs);
    };
    fetchData();
  }, []);

  const [filtros, setFiltros] = useState({
    estado: '',
    tecnico: '',
    prioridad: '',
    busqueda: ''
  });

  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);
  const [nombreInput, setNombreInput] = useState('');
  const [passInput, setPassInput] = useState('');

  const manejarCambioFiltro = (e) => {
    setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const manejarCambioAveria = (id, campo, valor) => {
    const url = `/averia/${id}/${campo === 'asignadoA' ? 'tecnico' : campo}`;
    const body = {};
    if (campo === 'asignadoA') {
        body.tecnicoId = parseInt(valor);
    } else {
        body[campo] = valor.toUpperCase().replace(/-/g, '_');
    }

    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al actualizar');
      setAverias(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a));
    })
    .catch(err => alert(err.message));
  };

  const manejarVerificar = (id) => {
    fetch(`/averia/${id}/verificar`, { method: 'PATCH' })
    .then(res => {
      if (!res.ok) throw new Error('Error al verificar');
      alert("¡Avería publicada con éxito!");
      setAverias(prev => prev.map(a => a.id === id ? { ...a, verificada: true } : a));
    })
    .catch(err => alert(err.message));
  };

  const manejarNavegacionInicio = () => {
    if (cerrarSesion) {
      cerrarSesion();
    } else {
      navegar('bienvenida');
    }
  };
  const manejarNavegacionAveriasUsuarios = () => navegar('usuarios-averias');
  const manejarNavegacionCrearUsuario = () => navegar('crear-usuario');

  const averiasFiltradas = averias.filter(averia => {
    const s = filtros.busqueda.toLowerCase();
    const coincideBusqueda = s === '' || averia.titulo.toLowerCase().includes(s) || averia.ubicacion.toLowerCase().includes(s) || averia.descripcion.toLowerCase().includes(s);
    const coincideEstado = filtros.estado === '' || averia.estado === filtros.estado;
    const coincideTecnico = filtros.tecnico === '' || averia.asignadoA === parseInt(filtros.tecnico);
    const coincidePrioridad = filtros.prioridad === '' || averia.prioridad === filtros.prioridad;

    let baseMatch = coincideBusqueda && coincideEstado && coincideTecnico && coincidePrioridad;
    if (!baseMatch) return false;

    
    if (rolUsuario === 'tecnico') {
      if (averia.asignadoA !== parseInt(idUsuario)) return false;
      if (viewMode === 'terminadas') return averia.estado === 'terminada';
      if (viewMode === 'publicadas') return averia.estado !== 'terminada';
      return false;
    }

    
    if (viewMode === 'pendientes') return !averia.verificada;
    if (viewMode === 'terminadas') return averia.estado === 'terminada' && averia.verificada;
    if (viewMode === 'publicadas') return averia.estado !== 'terminada' && averia.verificada;

    return false;
  });

  const etiquetasEstado = {
    'sin-empezar': 'Sin empezar',
    'en-reparacion': 'En Reparación',
    'terminada': 'Terminada'
  };

  
  if (mostrarModalPerfil) {
    return (
      <section className="seccion-vista active">
        <div className="tarjeta">
          <div className="cabecera-vista">
            <button className="boton-volver" onClick={() => setMostrarModalPerfil(false)}>
              <span className="icon-arrow-left2"></span> Volver al Panel
            </button>
          </div>
          <h2 className="titulo-modal">Modificar Perfil</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            fetch(`/user/${idUsuario}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nombre: nombreInput, password: passInput || undefined })
            })
            .then(res => {
              if (!res.ok) throw new Error('Error al actualizar perfil');
              return res.json();
            })
            .then(() => {
              if (actualizarPerfil) actualizarPerfil(nombreInput);
              setMostrarModalPerfil(false);
              alert('Perfil actualizado con éxito');
            })
            .catch(err => alert(err.message));
          }}>
            <div className="grupo-formulario">
              <label className="etiqueta-formulario">Nombre de Usuario</label>
              <input className="control-formulario" value={nombreInput} onChange={(e) => setNombreInput(e.target.value)} required />
            </div>
            <div className="grupo-formulario">
              <label className="etiqueta-formulario">Nueva Contraseña</label>
              <input className="control-formulario" type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="Dejar en blanco para omitir" />
            </div>
            <div className="botones-modal-contenedor">
              <button type="button" className="boton boton-secundario boton-modal" onClick={() => setMostrarModalPerfil(false)}>Cancelar</button>
              <button type="submit" className="boton boton-principal boton-modal">Aplicar</button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion-vista active seccion-amplia">
      <div className="contenedor-admin">
        <style dangerouslySetInnerHTML={{__html: `
          /* Desktop Safe Defaults */
          .seccion-amplia { max-width: 100% !important; padding: 2rem 5% !important; }
          .contenedor-admin { max-width: 100% !important; width: 100% !important; }
          .admin-acciones-mobile { display: none !important; }
          .cabecera-superior { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 2rem; }
          .flex-centrado { display: flex; align-items: center; gap: 1.5rem; }
          .contenedor-acciones-derecha { display: flex; flex-direction: column; align-items: flex-end; }
          .panel-usuario-cabecera { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 0.8rem 1.2rem; background-color: #f8f9fa; border-radius: 12px; border: 1px solid #E1E5F2; min-width: 550px; }
          .boton-modificar-perfil { padding: 0.5rem 0.8rem !important; font-size: 0.8rem !important; width: auto !important; min-width: auto !important; white-space: nowrap !important; flex-shrink: 0 !important; }
          .columna-usuario { display: flex; flex-direction: column; }
          .nombre-usuario-cabecera { font-weight: bold; font-size: 1.05rem; }
          .rol-usuario-cabecera { font-size: 0.85rem; color: #64748b; }
          .botones-header-admin { display: flex; gap: 1rem; align-items: center; justify-content: flex-end; width: auto; }
          .fila-buscador { display: flex; justify-content: space-between; align-items: center; width: 100%; }
          .contenedor-buscador-principal { flex: 1; margin-right: 2rem; max-width: 400px; display:flex; position:relative; }
          
          /* Mobile Overrides (Match the precise screenshot requested) */
          @media (max-width: 768px) {
             .admin-acciones-desktop { display: none !important; }
             .admin-acciones-mobile { display: flex !important; width: 100%; gap: 1rem; justify-content: space-between; margin-top: 1rem; margin-bottom: 0.5rem; }
             .admin-acciones-mobile button { flex: 1; margin: 0 !important; width: 100%; }
             
             .cabecera-superior { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 1.5rem; margin-bottom: 1rem; }
             .flex-centrado { flex-direction: column !important; gap: 0.5rem; }
             .contenedor-acciones-derecha { align-items: center !important; width: 100% !important; }
             .panel-usuario-cabecera { min-width: 100% !important; width: 100% !important; flex-direction: column !important; padding: 1rem !important; }
             
             .fila-buscador { flex-direction: column-reverse !important; gap: 1rem; align-items: stretch !important; }
             .botones-header-admin { width: 100% !important; justify-content: space-between !important; gap: 0.5rem; flex-wrap: nowrap !important; }
             .botones-header-admin button { font-size: 0.75rem !important; padding: 0.5rem !important; flex: 1; white-space: nowrap; margin: 0!important; }
             .contenedor-buscador-principal { margin-right: 0 !important; max-width: 100% !important; }
             .input-buscador-principal { padding-left: 2.8rem !important; }
          }
        `}} />
        <div className="cabecera-vista">
          {(!isMobile) && (
            <button onClick={manejarNavegacionInicio} className="boton-volver">
              <span className="icon-exit"></span> Cerrar Sesión / Volver
            </button>
          )}
        </div>
        
        <div className="cabecera-panel-doble">
          
          {}
          <div className="cabecera-superior">
            <div className="flex-centrado" style={{ position: 'relative' }}>
              {isMobile && (
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  <button 
                    onClick={() => setVerMenuMovil(!verMenuMovil)} 
                    style={{ background: 'none', border: 'none', padding: '0 0.5rem 0 0', fontSize: '2rem', cursor: 'pointer', color: '#002b2b', display: 'flex', alignItems: 'center' }}
                  >
                    ☰
                  </button>
                  {verMenuMovil && (
                    <div style={{ position: 'absolute', top: '100%', left: '0', background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,39,40,0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px', border: '1px solid #E1E5F2', zIndex: 9999 }}>
                      <button onClick={manejarNavegacionInicio} className="boton-volver" style={{ marginBottom: '0.5rem', color: '#ef476f', fontSize: '0.9rem' }}>
                        <span className="icon-exit"></span> Cerrar Sesión
                      </button>
                      <hr style={{ border: 'none', borderTop: '1px solid #E1E5F2', margin: '0 0 0.5rem 0' }} />
                      
                      {rolUsuario === 'admin' && (
                        <button 
                          onClick={() => { setViewMode('pendientes'); setFiltros(prev => ({ ...prev, estado: '' })); setVerMenuMovil(false); }} 
                          className={`boton ${viewMode === 'pendientes' ? 'boton-principal' : 'boton-secundario'}`}
                          style={{ padding: '0.6rem', fontSize: '0.85rem', margin: 0 }}
                        >
                          Pendientes ({averias.filter(a => !a.verificada).length})
                        </button>
                      )}
                      
                      <button 
                        onClick={() => { setViewMode('publicadas'); setVerMenuMovil(false); }} 
                        className={`boton ${viewMode === 'publicadas' ? 'boton-principal' : 'boton-secundario'}`}
                        style={{ padding: '0.6rem', fontSize: '0.85rem', margin: 0 }}
                      >
                        {rolUsuario === 'admin' ? 'Publicadas' : 'Asignadas'} ({averias.filter(a => a.estado !== 'terminada' && (rolUsuario === 'tecnico' ? a.asignadoA === parseInt(idUsuario) : a.verificada)).length})
                      </button>

                      <button 
                        onClick={() => { setViewMode('terminadas'); setVerMenuMovil(false); }} 
                        className={`boton ${viewMode === 'terminadas' ? 'boton-principal' : 'boton-secundario'}`}
                        style={{ padding: '0.6rem', fontSize: '0.85rem', margin: 0 }}
                      >
                        Terminadas ({averias.filter(a => a.estado === 'terminada' && (rolUsuario === 'tecnico' ? a.asignadoA === parseInt(idUsuario) : a.verificada)).length})
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="contenedor-logo">
                <img src="/logo-silverfish.png" alt="Logo" className="imagen-logo" />
              </div>
              <div className="contenedor-titulo">
                <h2 className="texto-titulo">{rolUsuario === 'admin' ? 'Gestión de Averías' : 'Mis Averías Asignadas'}</h2>
                <p className="text-light texto-subtitulo">{rolUsuario === 'admin' ? 'Bienvenido, Equipo Coordinador' : 'Listado de tareas pendientes'}</p>
              </div>
            </div>
            
            <div className="contenedor-acciones-derecha">
                <div className="panel-usuario-cabecera">
                    <div className="columna-usuario">
                        <span className="nombre-usuario-cabecera">{nombreUsuario || 'Usuario'}</span>
                        <span className="rol-usuario-cabecera">Rol: {rolUsuario === 'admin' ? 'Administrador' : 'Técnico'}</span>
                    </div>
                    <button className="boton boton-secundario boton-modificar-perfil" onClick={() => {
                        setNombreInput(nombreUsuario || 'Usuario');
                        setPassInput('');
                        setMostrarModalPerfil(true);
                    }}>MODIFICAR PERFIL</button>
                </div>
                {}
                {rolUsuario === 'admin' && (
                  <div className="admin-acciones-mobile">
                    <button onClick={manejarNavegacionAveriasUsuarios} className="boton boton-secundario" style={{ borderRadius: '12px', padding: '0.6rem', fontSize: '0.9rem' }}>
                      USUARIOS
                    </button>
                    <button onClick={() => navegar('comunicar-averia')} className="boton boton-principal" style={{ borderRadius: '12px', padding: '0.6rem', fontSize: '0.9rem', backgroundColor: '#20c997', color: 'white' }}>
                      + AVERÍA
                    </button>
                  </div>
                )}
            </div>
          </div>

          {}
          <div className="fila-buscador">
            
            {}
            <div className="contenedor-buscador-principal">
              <span className="icon-search icono-buscador-principal" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#002b2b', opacity: 0.8, fontSize: '1.4rem', zIndex: 999 }}></span>
              <input 
                type="text" 
                name="busqueda" 
                onChange={manejarCambioFiltro} 
                className="control-formulario input-buscador-principal" 
                placeholder="Buscar por nombre, aula, estado..." 
                value={filtros.busqueda}
                style={{ paddingLeft: '65px' }}
              />
            </div>

            {}
            {!isMobile && (
              <div className="botones-header botones-header-admin">
                {rolUsuario === 'admin' && (
                  <button 
                    onClick={() => {
                      setViewMode('pendientes');
                      setFiltros(prev => ({ ...prev, estado: '' }));
                    }} 
                    className={`boton boton-header ${viewMode === 'pendientes' ? 'boton-principal' : 'boton-secundario'}`}
                  >
                    Pendientes ({averias.filter(a => !a.verificada).length})
                  </button>
                )}
                
                <button 
                  onClick={() => setViewMode('publicadas')} 
                  className={`boton boton-header ${viewMode === 'publicadas' ? 'boton-principal' : 'boton-secundario'}`}
                >
                  {rolUsuario === 'admin' ? 'Publicadas' : 'Asignadas'} ({averias.filter(a => a.estado !== 'terminada' && (rolUsuario === 'tecnico' ? a.asignadoA === parseInt(idUsuario) : a.verificada)).length})
                </button>

                <button 
                  onClick={() => setViewMode('terminadas')} 
                  className={`boton boton-header ${viewMode === 'terminadas' ? 'boton-principal' : 'boton-secundario'}`}
                >
                  Terminadas ({averias.filter(a => a.estado === 'terminada' && (rolUsuario === 'tecnico' ? a.asignadoA === parseInt(idUsuario) : a.verificada)).length})
                </button>

                {rolUsuario === 'admin' && (
                  <>
                    <div className="divisor-cabecera admin-acciones-desktop"></div>
                    <button onClick={manejarNavegacionAveriasUsuarios} className="boton boton-usuarios-admin admin-acciones-desktop">
                      Usuarios
                    </button>
                    <button onClick={() => navegar('comunicar-averia')} className="boton boton-nueva-averia-admin admin-acciones-desktop">
                      + Avería
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="filtros-barra-admin" style={isMobile ? { display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', gap: '0.4rem', width: '100%' } : {}}>
          <span className="filtros-label" style={isMobile ? { whiteSpace: 'nowrap' } : {}}>Filtrar por:</span>
          {viewMode !== 'pendientes' && (
            <select name="estado" onChange={manejarCambioFiltro} className="control-formulario select-sm select-filtro" value={filtros.estado} style={isMobile ? { width: 'auto', minWidth: 'auto', fontSize: '0.8rem', padding: '0.3rem 1.8rem 0.3rem 0.6rem', border: '1px solid #E1E5F2', borderRadius: '8px' } : {}}>
              <option value="">{isMobile ? 'Estados' : 'Todos los Estados'}</option>
              <option value="sin-empezar">Sin empezar</option>
              <option value="en-reparacion">En reparación</option>
              <option value="terminada">Terminada</option>
            </select>
          )}
          {rolUsuario === 'admin' && (
            <>
              <select name="tecnico" onChange={manejarCambioFiltro} className="control-formulario select-sm select-filtro" value={filtros.tecnico} style={isMobile ? { width: 'auto', minWidth: 'auto', fontSize: '0.8rem', padding: '0.3rem 1.8rem 0.3rem 0.6rem', border: '1px solid #E1E5F2', borderRadius: '8px' } : {}}>
                <option value="">{isMobile ? 'Técnicos' : 'Todos los Técnicos'}</option>
                {techs.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
              <select name="prioridad" onChange={manejarCambioFiltro} className="control-formulario select-sm select-filtro" value={filtros.prioridad} style={isMobile ? { width: 'auto', minWidth: 'auto', fontSize: '0.8rem', padding: '0.3rem 1.8rem 0.3rem 0.6rem', border: '1px solid #E1E5F2', borderRadius: '8px' } : {}}>
                <option value="">{isMobile ? 'Prioridades' : 'Todas las Prioridades'}</option>
                <option value="critica">Crítica</option>
                <option value="menor">Menor</option>
                <option value="acumulable">Acumulable</option>
              </select>
            </>
          )}
        </div>

        <div className="lista-averias lista-averias-margin">
          {averiasFiltradas.map(averia => (
            <div key={averia.id} className={`tarjeta-averia priority-${averia.prioridad}`}>
              <div className="cabecera-averia">
                <div>
                  <h3 className="titulo-averia">{averia.titulo}</h3>
                  <div className="meta-averia">
                    <span>{averia.categoria}</span> • <span>{averia.ubicacion}</span>
                  </div>
                </div>
                <span className={`distintivo distintivo-estado ${averia.estado !== 'sin-empezar' ? averia.estado : ''}`}>
                  {etiquetasEstado[averia.estado]}
                </span>
                {rolUsuario === 'admin' && !averia.verificada && (
                  <button 
                    onClick={() => manejarVerificar(averia.id)} 
                    className="boton-crear-averia-admin boton-publicar-averia"
                  >
                    CREAR / PUBLICAR
                  </button>
                )}
              </div>
              <p className="text-light">{averia.descripcion}</p>
              <div className="acciones-averia">
                {rolUsuario === 'admin' && averia.estado !== 'terminada' ? (
                  <>
                    <div>
                      <label className="etiqueta-formulario label-sm">Prioridad</label>
                      <select 
                        onChange={(e) => manejarCambioAveria(averia.id, 'prioridad', e.target.value)} 
                        className="control-formulario select-sm" 
                        value={averia.prioridad}
                      >
                        <option value="critica">Crítica</option>
                        <option value="menor">Menor</option>
                        <option value="acumulable">Acumulable</option>
                      </select>
                    </div>
                    <div>
                      <label className="etiqueta-formulario label-sm">Asignado a</label>
                      <select 
                        onChange={(e) => manejarCambioAveria(averia.id, 'asignadoA', e.target.value)} 
                        className="control-formulario select-sm" 
                        value={averia.asignadoA}
                      >
                        <option value="">Sin asignar</option>
                        {techs.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="campo-estatico-contenedor">
                      <label className="etiqueta-formulario label-sm">Prioridad</label>
                      <div className="valor-estatico">{averia.prioridad.toUpperCase()}</div>
                    </div>
                    <div className="campo-estatico-contenedor">
                      <label className="etiqueta-formulario label-sm">Asignado a</label>
                      <div className="valor-estatico">{techs.find(t => t.id === averia.asignadoA)?.nombre || 'Sin asignar'}</div>
                    </div>
                  </>
                )}
                <div className="columna-doble">
                  <label className="etiqueta-formulario label-sm">Estado Operativo</label>
                  <select 
                    onChange={(e) => manejarCambioAveria(averia.id, 'estado', e.target.value)} 
                    className="control-formulario select-sm" 
                    value={averia.estado}
                    disabled={averia.estado === 'terminada' && rolUsuario !== 'admin'}
                  >
                    <option value="sin-empezar">Sin empezar</option>
                    <option value="en-reparacion">En reparación</option>
                    <option value="terminada">Terminada</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
