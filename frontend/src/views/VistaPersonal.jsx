import React, { useState, useEffect } from 'react';

export function VistaPersonal({ navegar, rolUsuario, nombreUsuario, idUsuario, actualizarPerfil }) {
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);
  const [nombreInput, setNombreInput] = useState('');
  const [passInput, setPassInput] = useState('');

  const [cargando, setCargando] = useState(false);
  const [historialAverias, setHistorialAverias] = useState([]);

  useEffect(() => {
    const fetchHistory = () => {
      fetch('/averia')
        .then(res => res.json())
        .then(data => {
          // Filtrar por reportador.id si tenemos el ID del usuario actual
          const filtradas = data
            .filter(av => !idUsuario || (av.reportador && av.reportador.id === idUsuario))
            .map(av => ({
                id: av.id,
                titulo: av.nombre,
                ubicacion: av.ubicacion,
                descripcion: av.descripcion,
                categoria: av.tipo,
                estado: av.estado.toLowerCase().replace(/_/g, '-'),
                fecha: new Date(av.fecha_comunica).toLocaleDateString()
            }));
          setHistorialAverias(filtradas);
        });
    };
    fetchHistory();
  }, [idUsuario]);

  const manejarNavegacionInicio = () => navegar('bienvenida');

  const manejarEnvio = (e) => {
    e.preventDefault();
    const titulo = e.target.elements.nombre_averia.value;
    const ubicacion = e.target.elements.ubicacion.value;
    const descripcion = e.target.elements.descripcion.value;
    const categoria = e.target.elements.tipo_averia.value;
    
    setCargando(true);
    fetch('/averia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: titulo, tipo: categoria, ubicacion, descripcion, reportadorId: idUsuario })
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al enviar reporte');
      return res.json();
    })
    .then(() => {
      setCargando(false);
      alert('¡Avería enviada con éxito!');
      window.location.reload(); // Recargar para ver el historial actualizado
    })
    .catch(err => {
      setCargando(false);
      alert(err.message);
    });
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
          <div className="cabecera-superior" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex-centrado" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="contenedor-logo">
                <img src="/logo-silverfish.png" alt="Logo" className="imagen-logo" />
              </div>
              <div className="contenedor-titulo">
                <h2 className="texto-titulo" style={{ marginBottom: '0.2rem' }}>Panel del Personal</h2>
                <p className="text-light texto-subtitulo" style={{ margin: 0 }}>Gestión de reportes y estado de averías enviadas</p>
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
                     minWidth: '420px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--color-dark, #333)', lineHeight: '1.2', whiteSpace: 'nowrap' }}>{nombreUsuario || 'Usuario'}</span>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>Rol: Personal del Centro</span>
                    </div>
                    <button className="boton boton-secundario" style={{ marginTop: 0, padding: '0.55rem 1.4rem', fontSize: '0.85rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)' }} onClick={() => {
                        setNombreInput(nombreUsuario || 'Usuario');
                        setPassInput('');
                        setMostrarModalPerfil(true);
                    }}>MODIFICAR PERFIL</button>
                </div>
            </div>
          </div>
        </div>

        <div className="cuerpo-personal" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="tarjeta" style={{ flex: '1', minWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Nueva Avería</h3>
                <form onSubmit={manejarEnvio}>
                    <div className="grupo-formulario">
                        <label className="etiqueta-formulario" htmlFor="nombre_averia">Breve título de la avería</label>
                        <input type="text" id="nombre_averia" className="control-formulario" placeholder="Ej: Proyector no enciende" required />
                    </div>
                    <div className="grupo-formulario">
                        <label className="etiqueta-formulario" htmlFor="tipo_averia">Tipo de Categoría</label>
                        <select id="tipo_averia" className="control-formulario" defaultValue="" required>
                            <option value="" disabled>Selecciona una categoría...</option>
                            <option value="Electricidad / Iluminación">Electricidad / Iluminación</option>
                            <option value="Fontanería / Baños">Fontanería / Baños</option>
                            <option value="Mobiliario Pizarras / Pupitres">Mobiliario Pizarras / Pupitres</option>
                            <option value="Informática / Redes">Informática / Redes</option>
                            <option value="Calefacción / Climatización">Calefacción / Climatización</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div className="grupo-formulario">
                        <label className="etiqueta-formulario" htmlFor="ubicacion">Ubicación exacta</label>
                        <input type="text" id="ubicacion" className="control-formulario" placeholder="Ej: Aula 204, Edificio Norte" required />
                    </div>
                    <div className="grupo-formulario">
                        <label className="etiqueta-formulario" htmlFor="descripcion">Descripción del problema</label>
                        <textarea id="descripcion" className="control-formulario" placeholder="Describe lo que ocurre..." required></textarea>
                    </div>
                    <button type="submit" className="boton boton-principal" disabled={cargando}>
                        {cargando ? 'Registrando...' : 'Lanzar Reporte'}
                    </button>
                </form>
            </div>

            <div className="tarjeta" style={{ flex: '1.5', minWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>Tu Historial de Solicitudes</h3>
                {historialAverias.length === 0 ? (
                    <div className="tarjeta" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <p className="text-light" style={{ margin: 0, opacity: 0.8 }}>No has comunicado ninguna avería en esta sesión.</p>
                    </div>
                ) : (
                    <div className="lista-averias" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {historialAverias.map(av => (
                            <div key={av.id} className="tarjeta-averia" style={{ backgroundColor: 'white', display: 'block', borderLeft: '4px solid #0056b3', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{av.titulo}</h4>
                                    <span className="distintivo distintivo-estado" style={{ backgroundColor: 'var(--color-blue-grey)', color: 'var(--color-dark)', padding: '0.4em 0.8em', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>{av.estado === 'sin-empezar' ? 'Sin empezar' : (av.estado === 'en-reparacion' ? 'En reparación' : 'Terminada')}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                                    <span>{av.categoria}</span> • <span style={{ fontWeight: 'bold', color: '#333' }}>{av.ubicacion}</span> • {av.fecha}
                                </div>
                                <p className="text-light" style={{ fontSize: '0.9rem', marginBottom: 0, lineHeight: 1.5 }}>{av.descripcion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
