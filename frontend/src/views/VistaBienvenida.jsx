import React from 'react';

export function VistaBienvenida({ navegar }) {
  const irAReporte = () => navegar('comunicar-averia');
  const irALogin = () => navegar('acceso');

  return (
    <section className="seccion-vista active contenedor-bienvenida">
      <div className="fondo-bienvenida">
        <div className="circle-blob blob-1"></div>
        <div className="circle-blob blob-2"></div>
        <div className="glass-overlay"></div>
      </div>

      <div className="contenido-bienvenida">
        <div className="cabecera-bienvenida">
          <div id="logo-bienvenida-icono" className="icono-marca-bienvenida">
            <img id="logo-bienvenida-imagen" src="/logo-silverfish.png" alt="Silverfish Logo" />
          </div>
          <h1 className="titulo-bienvenida">Silverfish</h1>
          <p className="subtitulo-bienvenida">Plataforma de mantenimiento escolar</p>
        </div>

        <div className="contenedor-tarjetas-bienvenida">
          <button type="button" onClick={irAReporte} className="tarjeta-opcion-bienvenida hover-lift">
            <div className="contenedor-icono-tarjeta icono-reporte">
              <span id="icono-reporte-icomoon" className="icon-warning"></span>
            </div>
            <h2 className="titulo-tarjeta">Comunicar Avería</h2>
            <p className="descripcion-tarjeta">No necesitas cuenta. Entra como invitado para notificar un desperfecto rápidamente.</p>
            <div className="accion-tarjeta">
              Comenzar reporte <span id="icono-flecha-icomoon" className="icon-arrow-right2"></span>
            </div>
          </button>

          <button type="button" onClick={irALogin} className="tarjeta-opcion-bienvenida hover-lift">
            <div className="contenedor-icono-tarjeta icono-usuario">
              <span id="icono-usuario-icomoon" className="icon-user"></span>
            </div>
            <h2 className="titulo-tarjeta">Acceso Personal</h2>
            <p className="descripcion-tarjeta">Si eres profesor, conserje o técnico, accede aquí para gestionar las averías del centro.</p>
            <div className="accion-tarjeta">
              Iniciar sesión <span id="icono-flecha-icomoon" className="icon-arrow-right2"></span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
