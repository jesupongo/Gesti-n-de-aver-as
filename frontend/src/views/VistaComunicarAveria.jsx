import React, { useState } from 'react';

export function VistaComunicarAveria({ navegar, idUsuario }) {
  const [cargando, setCargando] = useState(false);

  const irInicio = () => navegar('bienvenida');

  const manejarEnvio = (e) => {
    e.preventDefault();
    const titulo = document.getElementById('nombre_averia').value;
    const categoria = document.getElementById('tipo_averia').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const descripcion = document.getElementById('descripcion').value;

    setCargando(true);
    fetch('/averia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nombre: titulo, 
        tipo: categoria, 
        ubicacion, 
        descripcion,
        reportadorId: idUsuario ? parseInt(idUsuario) : undefined
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al enviar reporte');
      return res.json();
    })
    .then(() => {
      setCargando(false);
      alert("¡Avería enviada con éxito! El equipo de mantenimiento la evaluará en breve.");
      navegar('bienvenida');
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
          <button onClick={irInicio} className="boton-volver">
            <span className="icon-arrow-left2"></span> Volver al Inicio
          </button>
        </div>
        
        <div className="cabecera-con-logo">
          <div className="contenedor-logo-pequeno">
            <img src="/logo-silverfish.png" alt="Logo" className="img-logo-pequeno" />
          </div>
          <div className="columna-texto-cabecera">
            <h2 className="titulo-cabecera-ajuste">Comunicar Avería</h2>
            <p className="text-light subtitulo-cabecera-ajuste">Por favor, detalla la incidencia para que el equipo técnico pueda resolverla lo antes posible.</p>
          </div>
        </div>
        
        <form onSubmit={manejarEnvio} className="mt-4">
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="nombre_averia">Breve título de la avería</label>
            <input type="text" id="nombre_averia" className="control-formulario" placeholder="Ej: Proyector no enciende" required />
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="tipo_averia">Tipo de Categoría</label>
            <select id="tipo_averia" className="control-formulario" defaultValue="" required>
              <option value="" disabled>Selecciona una categoría...</option>
              <option value="electricidad">Electricidad / Iluminación</option>
              <option value="fontaneria">Fontanería / Baños</option>
              <option value="mobilario">Mobiliario Pizarras / Pupitres</option>
              <option value="informatica">Informática / Redes</option>
              <option value="climatizacion">Calefacción / Climatización</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="ubicacion">Ubicación exacta</label>
            <input type="text" id="ubicacion" className="control-formulario" placeholder="Ej: Aula 204, Edificio Norte" required />
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="descripcion">Descripción del problema</label>
            <textarea id="descripcion" className="control-formulario" placeholder="Describe brevemente lo que ocurre. ¿Desde cuándo pasa? ¿Hay algún peligro inmediato?" required></textarea>
          </div>

          <button type="submit" className="boton boton-principal" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </form>
      </div>
    </section>
  );
}
