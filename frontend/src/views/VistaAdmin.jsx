import React, { useState, useEffect } from 'react';

const averiasIniciales = [
  {
    id: 1,
    titulo: 'Proyector no enciende',
    categoria: 'Informática',
    ubicacion: 'Aula 204',
    descripcion: 'Al encender parpadea luz roja y no da imagen.',
    prioridad: 'critica',
    estado: 'sin-empezar',
    asignadoA: 'admin'
  },
  {
    id: 2,
    titulo: 'Grifo Gotea',
    categoria: 'Fontanería',
    ubicacion: 'Baño Infantil',
    descripcion: 'Pierde agua constantemente, llave de paso cerrada.',
    prioridad: 'menor',
    estado: 'en-reparacion',
    asignadoA: 'jorge'
  },
  {
    id: 3,
    titulo: 'Pintura desconchada',
    categoria: 'Otros',
    ubicacion: 'Pasillo Central',
    descripcion: 'La pared necesita repaso en la zona baja.',
    prioridad: 'acumulable',
    estado: 'terminada',
    asignadoA: 'admin'
  }
];

export function VistaAdmin({ navegar, rolUsuario, nombreUsuario, idUsuario, actualizarPerfil }) {
  const [averias, setAverias] = useState([]);
  const [techs, setTechs] = useState([]);
  const [viewMode, setViewMode] = useState('pendientes'); // 'pendientes' o 'publicadas'

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

  const manejarNavegacionInicio = () => navegar('bienvenida');
  const manejarNavegacionAveriasUsuarios = () => navegar('usuarios-averias');
  const manejarNavegacionCrearUsuario = () => navegar('crear-usuario');

  const averiasFiltradas = averias.filter(averia => {
    const s = filtros.busqueda.toLowerCase();
    const coincideBusqueda = s === '' || averia.titulo.toLowerCase().includes(s) || averia.ubicacion.toLowerCase().includes(s) || averia.descripcion.toLowerCase().includes(s);
    const coincideEstado = filtros.estado === '' || averia.estado === filtros.estado;
    const coincideTecnico = filtros.tecnico === '' || averia.asignadoA === filtros.tecnico;
    const coincidePrioridad = filtros.prioridad === '' || averia.prioridad === filtros.prioridad;

    let coincidenciaFiltros = coincideBusqueda && coincideEstado && coincideTecnico && coincidePrioridad;
    
    // Restricción para técnicos: solo ver lo suyo Y que esté verificado
    if (rolUsuario !== 'admin') {
      return coincidenciaFiltros && averia.asignadoA === parseInt(idUsuario) && averia.verificada;
    }

    // Lógica de bandejas para Admin
    if (viewMode === 'pendientes') {
        return coincidenciaFiltros && !averia.verificada;
    } else {
        return coincidenciaFiltros && averia.verificada;
    }
  });

  const etiquetasEstado = {
    'sin-empezar': 'Sin empezar',
    'en-reparacion': 'En Reparación',
    'terminada': 'Terminada'
  };

  return (
    <section className="seccion-vista active seccion-amplia">
      <div className="contenedor-admin" style={{ padding: '1rem 0' }}>
        <div className="cabecera-vista">
          <button onClick={manejarNavegacionInicio} className="boton-volver">
            <span className="icon-exit"></span> Cerrar Sesión / Volver
          </button>
        </div>
        
        <div className="cabecera-panel-doble" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Fila 1: Logo, Título y Panel Usuario */}
          <div className="cabecera-superior" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex-centrado" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="contenedor-logo">
                <img src="/logo-silverfish.png" alt="Logo" className="imagen-logo" />
              </div>
              <div className="contenedor-titulo">
                <h2 className="texto-titulo" style={{ marginBottom: '0.2rem' }}>{rolUsuario === 'admin' ? 'Gestión de Averías' : 'Mis Averías Asignadas'}</h2>
                <p className="text-light texto-subtitulo" style={{ margin: 0 }}>{rolUsuario === 'admin' ? 'Bienvenido, Equipo Coordinador' : 'Listado de tareas pendientes'}</p>
              </div>
            </div>
            
            <div className="contenedor-acciones-derecha" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div className="panel-usuario-cabecera" style={{ 
                     display: 'flex', 
                     alignItems: 'center',
                     justifyContent: 'space-between', 
                     gap: '1.5rem', 
                     padding: '1rem 1.5rem', 
                     backgroundColor: 'var(--color-bg-secondary, #f8f9fa)', 
                     borderRadius: 'var(--radius-md)',
                     border: '1px solid #E1E5F2',
                     minWidth: '350px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--color-dark, #333)', lineHeight: '1.2', whiteSpace: 'nowrap' }}>{nombreUsuario || 'Usuario'}</span>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Rol: {rolUsuario === 'admin' ? 'Administrador' : 'Técnico'}</span>
                    </div>
                    <button className="boton boton-secundario" style={{ marginTop: 0, padding: '0.55rem 1.4rem', fontSize: '0.85rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)' }} onClick={() => {
                        setNombreInput(nombreUsuario || 'Usuario');
                        setPassInput('');
                        setMostrarModalPerfil(true);
                    }}>MODIFICAR PERFIL</button>
                </div>
            </div>
          </div>

          {/* Fila 2: Buscador y Botones Secundarios */}
          <div className="cabecera-inferior" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '2rem' }}>
            
            <div className="caja-busqueda caja-busqueda-ancha" style={{ margin: 0, flex: 1, maxWidth: '600px', position: 'relative' }}>
              <span className="icon-search" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, fontSize: '20px' }}></span>
              <input 
                type="text" 
                name="busqueda" 
                onChange={manejarCambioFiltro} 
                className="control-formulario" 
                placeholder="Buscar por nombre, aula, estado..." 
                value={filtros.busqueda}
                style={{ width: '100%', paddingLeft: '3.5rem', paddingRight: '1.5rem', borderRadius: '50px', backgroundColor: 'var(--color-white)', border: '1px solid #d1d5db', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              />
            </div>

            <div className="botones-header" style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
              {rolUsuario === 'admin' && (
                <>
                  <button onClick={() => setViewMode('pendientes')} className={`boton ${viewMode === 'pendientes' ? 'boton-principal' : 'boton-secundario'} boton-header`} style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
                    Pendientes
                  </button>
                  <button onClick={() => setViewMode('publicadas')} className={`boton ${viewMode === 'publicadas' ? 'boton-principal' : 'boton-secundario'} boton-header`} style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
                    Publicadas
                  </button>
                  <button onClick={manejarNavegacionAveriasUsuarios} className="boton boton-secundario boton-header" style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
                    Usuarios
                  </button>
                  <button onClick={manejarNavegacionCrearUsuario} className="boton boton-secundario boton-header" style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
                    + Crear Usuario
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="filtros-barra-admin">
          <span className="filtros-label">Filtrar por:</span>
          <select name="estado" onChange={manejarCambioFiltro} className="control-formulario select-sm select-filtro" value={filtros.estado}>
            <option value="">Todos los Estados</option>
            <option value="sin-empezar">Sin empezar</option>
            <option value="en-reparacion">En reparación</option>
            <option value="terminada">Terminada</option>
          </select>
          {rolUsuario === 'admin' && (
            <>
              <select name="tecnico" onChange={manejarCambioFiltro} className="control-formulario select-sm select-filtro" value={filtros.tecnico}>
                <option value="">Todos los Técnicos</option>
                {techs.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
              <select name="prioridad" onChange={manejarCambioFiltro} className="control-formulario select-sm select-filtro" value={filtros.prioridad}>
                <option value="">Todas las Prioridades</option>
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
                    className="boton-crear-averia-admin"
                    style={{ 
                        marginLeft: '1rem', 
                        padding: '0.4rem 1rem', 
                        backgroundColor: '#2ecc71', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                    }}
                  >
                    CREAR / PUBLICAR
                  </button>
                )}
              </div>
              <p className="text-light">{averia.descripcion}</p>
              <div className="acciones-averia">
                {rolUsuario === 'admin' ? (
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
                    <div style={{ opacity: 0.7 }}>
                      <label className="etiqueta-formulario label-sm">Prioridad</label>
                      <div className="valor-estatico">{averia.prioridad.toUpperCase()}</div>
                    </div>
                    <div style={{ opacity: 0.7 }}>
                      <label className="etiqueta-formulario label-sm">Asignado a</label>
                      <div className="valor-estatico">{techs.find(t => t.id === averia.asignadoA)?.nombre || 'Yo'}</div>
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

      {mostrarModalPerfil && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,39,40,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.3s ease forwards' }}>
          <div className="tarjeta" style={{ width: '450px', maxWidth: '90%', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Modificar Perfil</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (actualizarPerfil) actualizarPerfil(nombreInput);
              setMostrarModalPerfil(false);
            }}>
              <div className="grupo-formulario">
                 <label className="etiqueta-formulario">Nombre de Usuario</label>
                 <input className="control-formulario" value={nombreInput} onChange={(e) => setNombreInput(e.target.value)} required />
              </div>
              <div className="grupo-formulario">
                 <label className="etiqueta-formulario">Nueva Contraseña</label>
                 <input className="control-formulario" type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="Dejar en blanco para omitir" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <button type="button" className="boton boton-secundario" style={{ marginTop: 0 }} onClick={() => setMostrarModalPerfil(false)}>Cancelar</button>
                 <button type="submit" className="boton boton-principal" style={{ marginTop: 0 }}>Aplicar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
