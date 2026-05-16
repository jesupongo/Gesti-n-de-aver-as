function ie({ navegar, rolUsuario, nombreUsuario }) {
  const el = b.createElement;
  const [terminoBusqueda, setTerminoBusqueda] = (0,b.useState)("");
  const [usuarios, setUsuarios] = (0,b.useState)([]);
  const [mostrarModalEditar, setMostrarModalEditar] = (0,b.useState)(false);
  const [usuarioEdicion, setUsuarioEdicion] = (0,b.useState)(null);
  const [nombreModal, setNombreModal] = (0,b.useState)("");
  const [passModal, setPassModal] = (0,b.useState)("");

  const cargarUsuarios = () => {
    fetch("/user")
      .then(res => res.json())
      .then(data => {
        setUsuarios(data.map(u => ({
          id: u.id,
          nombre: u.nombre,
          rol: u.rol === "ADMINISTRADOR" ? "Administrador" : u.rol === "MANTENIMIENTO" ? "Técnico" : "Personal",
          rolOriginal: u.rol,
          correo: u.email,
          averiasComunicadas: []
        })));
      });
  };

  (0,b.useEffect)(() => {
    cargarUsuarios();
  }, []);

  const eliminarUsuario = (id, nombre) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar permanentemente al usuario: " + nombre + "?")) {
      fetch("/user/" + id, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Error al eliminar");
          alert("Usuario eliminado con éxito");
          cargarUsuarios();
        })
        .catch(err => alert(err.message));
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  if (!/admin/i.test(rolUsuario || "")) return el("section", { className: "seccion-vista active" }, el("div", { className: "tarjeta" }, el("h2", null, "Acceso Denegado")));

  return el("section", { className: "seccion-vista active seccion-amplia" }, [
    el("div", { className: "tarjeta tarjeta-amplia" }, [
      el("div", { className: "cabecera-vista" }, 
        el("button", { onClick: () => navegar("panel-admin"), className: "boton-volver" }, [
          el("span", { className: "icon-arrow-left2" }), " Volver al Panel Admin"
        ])
      ),
      el("div", { className: "cabecera-panel cabecera-panel-margin" }, [
        el("div", { className: "flex-centrado" }, [
          el("div", { className: "contenedor-logo" }, el("img", { src: "/logo-silverfish.png", className: "imagen-logo" })),
          el("div", { className: "contenedor-titulo" }, [
            el("h2", { className: "texto-titulo" }, "Usuarios y Averías"),
            el("p", { className: "text-light texto-subtitulo" }, "Listado de usuarios registrados")
          ])
        ]),
        el("div", { className: "caja-busqueda" }, [
          el("span", { className: "icon-search" }),
          el("input", { value: terminoBusqueda, onChange: e => setTerminoBusqueda(e.target.value), className: "control-formulario", placeholder: "Buscar por nombre o email..." })
        ])
      ]),
      el("div", { className: "lista-usuarios" }, [
        usuariosFiltrados.length > 0 ? usuariosFiltrados.map(u => 
          el("div", { key: u.id, className: "tarjeta-averia tarjeta-usuario" }, [
            el("div", { className: "cabecera-averia cabecera-usuario" }, [
              el("div", null, [
                el("div", { style: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.2rem", flexWrap: "wrap" } }, [
                  el("h3", { className: "titulo-averia nombre-usuario", style: { margin: 0, whiteSpace: "nowrap" } }, u.nombre + (u.nombre === nombreUsuario ? " (tú)" : "")),
                  el("div", { style: { display: "flex", gap: "0.5rem" } }, [
                    el("button", { className: "boton boton-secundario", style: { padding: "0.4rem 0.8rem", fontSize: "0.75rem", marginTop: 0, borderRadius: "12px", whiteSpace: "nowrap" }, onClick: () => {
                      setUsuarioEdicion(u);
                      setNombreModal(u.nombre);
                      setPassModal("");
                      setMostrarModalEditar(true);
                    }}, "MODIFICAR"),
                    u.rolOriginal !== "ADMINISTRADOR" && el("button", { 
                      className: "boton", 
                      style: { padding: "0.4rem 0.8rem", fontSize: "0.75rem", marginTop: 0, borderRadius: "12px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", whiteSpace: "nowrap" }, 
                      onClick: () => eliminarUsuario(u.id, u.nombre) 
                    }, "ELIMINAR")
                  ])
                ]),
                el("div", { className: "meta-averia" }, [ el("span", null, u.rol), " • ", el("span", null, u.correo) ])
               ]),
              el("div", { className: "texto-derecha" }, el("span", { className: "contador-averias" }, "Usuario Registrado"))
            ]),
            el("div", null, el("p", { className: "text-light no-averias" }, "Historial de averías disponible en la base de datos."))
          ])
        ) : el("p", { className: "text-light no-usuarios" }, "No se encontraron usuarios.")
      ])
    ]),
    mostrarModalEditar && el("div", { style: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,39,40,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" } }, 
      el("div", { className: "tarjeta", style: { width: "450px", maxWidth: "90%", padding: "2.5rem" } }, [
        el("h2", { style: { marginBottom: "1.5rem", textAlign: "center" } }, "Modificar Perfil de " + usuarioEdicion?.nombre),
        el("form", { onSubmit: (e) => {
          e.preventDefault();
          fetch(`/user/${usuarioEdicion.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreModal, password: passModal || undefined })
          })
          .then(res => {
            if (!res.ok) throw new Error("Error al actualizar");
            alert("Usuario actualizado");
            cargarUsuarios();
            setMostrarModalEditar(false);
          })
          .catch(err => alert(err.message));
        }}, [
          el("div", { className: "grupo-formulario" }, [
            el("label", { className: "etiqueta-formulario" }, "Nombre de Usuario"),
            el("input", { className: "control-formulario", value: nombreModal, onChange: e => setNombreModal(e.target.value), required: true })
          ]),
          el("div", { className: "grupo-formulario" }, [
            el("label", { className: "etiqueta-formulario" }, "Nueva Contraseña"),
            el("input", { className: "control-formulario", type: "password", value: passModal, onChange: e => setPassModal(e.target.value), placeholder: "En blanco para omitir" })
          ]),
          el("div", { style: { display: "flex", gap: "1rem", marginTop: "2rem" } }, [
            el("button", { type: "button", className: "boton boton-secundario", style: { marginTop: 0 }, onClick: () => setMostrarModalEditar(false) }, "Cancelar"),
            el("button", { type: "submit", className: "boton boton-principal", style: { marginTop: 0 } }, "Aplicar")
          ])
        ])
      ])
    )
  ]);
}
