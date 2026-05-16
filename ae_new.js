function ae({ navegar, idUsuario, nombreUsuario, actualizarPerfil }) {
  const el = b.createElement;
  const [cargando, setCargando] = (0,b.useState)(false);
  const [historial, setHistorial] = (0,b.useState)([]);
  
  // Perfil modal states
  const [mostrarModal, setMostrarModal] = (0,b.useState)(false);
  const [inputNombre, setInputNombre] = (0,b.useState)(nombreUsuario || "");
  const [inputPass, setInputPass] = (0,b.useState)("");

  const userId = parseInt(idUsuario) || parseInt(localStorage.getItem("u")) || 0;

  (0,b.useEffect)(() => {
    if (!userId) return;
    fetch("/averia")
      .then(res => res.json())
      .then(data => {
        const filtradas = data
          .filter(av => {
             if (!av.reportador) return false;
             return parseInt(av.reportador.id) === userId;
          })
          .map(av => ({
            id: av.id,
            titulo: av.nombre,
            ubicacion: av.ubicacion,
            descripcion: av.descripcion,
            categoria: av.tipo,
            estado: av.estado.toLowerCase().replace(/_/g, "-"),
            fecha: new Date(av.fecha_comunica).toLocaleDateString()
          }));
        setHistorial(filtradas);
      })
      .catch(e => console.error("Fetch errors:", e));
  }, [userId]);

  const maneja = (event) => {
    event.preventDefault();
    const t = document.getElementById("nombre_averia").value;
    const k = document.getElementById("tipo_averia").value;
    const u = document.getElementById("ubicacion").value;
    const d = document.getElementById("descripcion").value;

    if (!userId || userId <= 0) { 
      alert("Error: Sesión no válida. Por favor, cierre sesión e inicie de nuevo."); 
      return; 
    }

    setCargando(true);
    fetch("/averia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: t, tipo: k, ubicacion: u, descripcion: d, reportadorId: userId })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al enviar reporte");
      return res.json();
    })
    .then(() => {
      setCargando(false);
      alert("¡Avería enviada con éxito!");
      window.location.reload();
    })
    .catch(err => {
      setCargando(false);
      alert(err.message);
    });
  };

  const confirmarCambios = (e) => {
    e.preventDefault();
    actualizarPerfil && actualizarPerfil(inputNombre);
    localStorage.setItem("n", inputNombre);
    setMostrarModal(false);
    alert("Perfil actualizado");
  };

  return el("section", { className: "seccion-vista active seccion-amplia" }, [
    el("div", { className: "contenedor-admin", style: { padding: "1rem 0" } }, [
      el("div", { className: "cabecera-vista" }, 
        el("button", { onClick: () => navegar("bienvenida"), className: "boton-volver" }, [
          el("span", { className: "icon-exit" }), " Cerrar Sesión / Volver"
        ])
      ),
      el("div", { className: "cabecera-panel-doble", style: { display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" } }, [
        el("div", { className: "cabecera-superior", style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, [
          el("div", { className: "flex-centrado", style: { display: "flex", alignItems: "center", gap: "1rem" } }, [
            el("div", { className: "contenedor-logo" }, el("img", { src: "/logo-silverfish.png", className: "imagen-logo", style: { width: "60px" } })),
            el("div", null, [
              el("h2", { className: "texto-titulo", style: { marginBottom: "0.2rem" } }, "Panel del Personal"),
              el("p", { className: "text-light", style: { margin: 0 } }, "Gestión de reportes y estado de averías enviadas")
            ])
          ]),
          el("div", { className: "contenedor-acciones-derecha", style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } }, 
            el("div", { className: "panel-usuario-cabecera", style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", padding: "1rem 1.5rem", backgroundColor: "#f8f9fa", borderRadius: "12px", border: "1px solid #E1E5F2", minWidth: "350px" } }, [
              el("div", { style: { display: "flex", flexDirection: "column" } }, [
                el("span", { style: { fontWeight: "bold", fontSize: "1.05rem", color: "#333", lineHeight: "1.2", whiteSpace: "nowrap" } }, nombreUsuario || "Usuario"),
                el("span", { style: { fontSize: "0.85rem", color: "#64748b" } }, "Rol: Personal del Centro")
              ]),
              el("button", { className: "boton boton-secundario", style: { marginTop: 0, padding: "0.55rem 1.4rem", fontSize: "0.85rem", whiteSpace: "nowrap", borderRadius: "12px" }, onClick: () => { setInputNombre(nombreUsuario); setMostrarModal(true); } }, "MODIFICAR PERFIL")
            ])
          )
        ])
      ]),
      el("div", { style: { display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" } }, [
        el("div", { className: "tarjeta", style: { flex: "1", minWidth: "400px" } }, [
          el("h3", { style: { marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" } }, "Nueva Avería"),
          el("form", { onSubmit: maneja }, [
            el("div", { className: "grupo-formulario" }, [
              el("label", { className: "etiqueta-formulario" }, "Título de la avería"),
              el("input", { id: "nombre_averia", className: "control-formulario", placeholder: "Ej: Proyector no enciende", required: true })
            ]),
            el("div", { className: "grupo-formulario" }, [
              el("label", { className: "etiqueta-formulario" }, "Categoría"),
              el("select", { id: "tipo_averia", className: "control-formulario", defaultValue: "", required: true }, [
                el("option", { value: "", disabled: true }, "Selecciona..."),
                el("option", { value: "Electricidad / Iluminación" }, "Electricidad"),
                el("option", { value: "Fontanería / Baños" }, "Fontanería"),
                el("option", { value: "Mobiliario Pizarras / Pupitres" }, "Mobiliario"),
                el("option", { value: "Informática / Redes" }, "Informática"),
                el("option", { value: "Calefacción / Climatización" }, "Calefacción"),
                el("option", { value: "Otros" }, "Otros")
              ])
            ]),
            el("div", { className: "grupo-formulario" }, [
              el("label", { className: "etiqueta-formulario" }, "Ubicación"),
              el("input", { id: "ubicacion", className: "control-formulario", placeholder: "Ej: Aula 204", required: true })
            ]),
            el("div", { className: "grupo-formulario" }, [
              el("label", { className: "etiqueta-formulario" }, "Descripción"),
              el("textarea", { id: "descripcion", className: "control-formulario", placeholder: "Describe el problema...", required: true })
            ]),
            el("button", { type: "submit", className: "boton boton-principal", disabled: cargando }, cargando ? "Registrando..." : "Lanzar Reporte")
          ])
        ]),
        el("div", { className: "tarjeta", style: { flex: "1.5", minWidth: "400px" } }, [
          el("h3", { style: { marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" } }, "Tu Historial"),
          historial.length === 0 
            ? el("div", { style: { textAlign: "center", padding: "3rem" } }, el("p", { className: "text-light" }, "Sin reportes para este usuario."))
            : el("div", { className: "lista-averias", style: { display: "flex", flexDirection: "column", gap: "1rem" } }, 
                historial.map(av => el("div", { key: av.id, className: "tarjeta-averia", style: { borderLeft: "4px solid #0056b3", padding: "1.2rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" } }, [
                  el("div", { style: { display: "flex", justifyContent: "space-between" } }, [
                    el("h4", { style: { margin: 0 } }, av.titulo),
                    el("span", { className: "distintivo", style: { fontSize: "0.75rem", backgroundColor: "var(--color-blue-grey)", color: "#333", padding: "4px 10px", borderRadius: "50px", fontWeight: "bold" } }, av.estado)
                  ]),
                  el("div", { style: { fontSize: "0.8rem", color: "#666", marginTop: "5px" } }, `${av.categoria} • ${av.ubicacion} • ${av.fecha}`),
                  el("p", { style: { fontSize: "0.9rem", marginTop: "10px", marginBottom: 0 } }, av.descripcion)
                ]))
              )
        ])
      ])
    ]),
    
    // Modal Perfil
    mostrarModal && el("div", { style: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,39,40,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" } }, 
      el("div", { className: "tarjeta", style: { width: "450px", maxWidth: "90%", padding: "2.5rem" } }, [
        el("h2", { style: { marginBottom: "1.5rem", textAlign: "center" } }, "Modificar Perfil"),
        el("form", { onSubmit: confirmarCambios }, [
          el("div", { className: "grupo-formulario" }, [
            el("label", { className: "etiqueta-formulario" }, "Nombre de Usuario"),
            el("input", { className: "control-formulario", value: inputNombre, onChange: e => setInputNombre(e.target.value), required: true })
          ]),
          el("div", { className: "grupo-formulario" }, [
            el("label", { className: "etiqueta-formulario" }, "Nueva Contraseña"),
            el("input", { className: "control-formulario", type: "password", value: inputPass, onChange: e => setInputPass(e.target.value), placeholder: "Dejar en blanco para omitir" })
          ]),
          el("div", { style: { display: "flex", gap: "1rem", marginTop: "2rem" } }, [
            el("button", { type: "button", className: "boton boton-secundario", style: { marginTop: 0 }, onClick: () => setMostrarModal(false) }, "Cancelar"),
            el("button", { type: "submit", className: "boton boton-principal", style: { marginTop: 0 } }, "Aplicar")
          ])
        ])
      ])
    )
  ]);
}
