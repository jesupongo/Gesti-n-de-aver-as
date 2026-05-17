import React, { useState, useEffect } from 'react';

export function VistaPersonal({ navegar, rolUsuario, nombreUsuario, idUsuario, actualizarPerfil, cerrarSesion }) {
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
          
          const filtradas = data
            .filter(av => !idUsuario || (av.reportador && av.reportador.id === parseInt(idUsuario)))
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

  const manejarNavegacionInicio = () => {
    if (cerrarSesion) {
      cerrarSesion();
    } else {
      navegar('bienvenida');
    }
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
      body: JSON.stringify({ nombre: titulo, tipo: categoria, ubicacion, descripcion, reportadorId: idUsuario ? parseInt(idUsuario) : undefined })
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al enviar reporte');
      return res.json();
    })
    .then(() => {
      setCargando(false);
      alert('¡Avería enviada con éxito!');
      window.location.reload(); 
    })
    .catch(err => {
      setCargando(false);
      alert(err.message);
    });
  };

  return (
    <section className="seccion-vista active seccion-amplia">
      <div className="contenedor-admin">
        <div className="cabecera-vista">
          <button onClick={manejarNavegacionInicio} className="boton-volver">
            <span className="icon-exit"></span> Cerrar Sesión / Volver
          </button>
        </div>
        
        <div className="cabecera-panel-doble">
          <div className="cabecera-superior">
            <div className="flex-centrado">
              <div className="contenedor-logo">
                <img src="/logo-silverfish.png" alt="Logo" className="imagen-logo" />
              </div>
              <div className="contenedor-titulo">
                <h2 className="texto-titulo">Panel del Personal</h2>
                <p className="text-light texto-subtitulo">Gestión de reportes y estado de averías enviadas</p>
              </div>
            </div>
            
            <div className="contenedor-acciones-derecha">
                <div className="panel-usuario-cabecera personal">
                    <div className="columna-usuario">
                        <span className="nombre-usuario-cabecera">{nombreUsuario || 'Usuario'}</span>
                        <span className="rol-usuario-cabecera">Rol: Personal del Centro</span>
                    </div>
                    <button className="boton boton-secundario boton-modificar-perfil" onClick={() => {
                        setNombreInput(nombreUsuario || 'Usuario');
                        setPassInput('');
                        setMostrarModalPerfil(true);
                    }}>MODIFICAR PERFIL</button>
                </div>
            </div>
          </div>
        </div>

        <div className="cuerpo-personal">
            <div className="tarjeta tarjeta-personal-nueva">
                <h3 className="titulo-seccion-tarjeta">Nueva Avería</h3>
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

            <div className="tarjeta tarjeta-personal-historial">
                <h3 className="titulo-seccion-tarjeta">Tu Historial de Solicitudes</h3>
                {historialAverias.length === 0 ? (
                    <div className="tarjeta tarjeta-vacia">
                        <p className="text-light texto-vacio">No has comunicado ninguna avería en esta sesión.</p>
                    </div>
                ) : (
                    <div className="lista-averias lista-averias-columna">
                        {historialAverias.map(av => (
                            <div key={av.id} className="tarjeta-averia tarjeta-averia-personal">
                                <div className="cabecera-tarjeta-personal">
                                    <h4 className="titulo-tarjeta-personal">{av.titulo}</h4>
                                    <span className="distintivo distintivo-estado">{av.estado === 'sin-empezar' ? 'Sin empezar' : (av.estado === 'en-reparacion' ? 'En reparación' : 'Terminada')}</span>
                                </div>
                                <div className="meta-tarjeta-personal">
                                    <span>{av.categoria}</span> • <span className="ubicacion-tarjeta-personal">{av.ubicacion}</span> • {av.fecha}
                                </div>
                                <p className="text-light descripcion-tarjeta-personal">{av.descripcion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>

      {mostrarModalPerfil && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="tarjeta tarjeta-modal">
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
        </div>,
        document.body
      )}
    </section>
  );
}
