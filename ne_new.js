function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:id_u,actualizarPerfil:r}){
  let[avs,setAvs]=(0,b.useState)([]);
  let[vm,svm]=(0,b.useState)("pendientes");
  let[tks,stk]=(0,b.useState)([]);
  let[mP,sMP]=(0,b.useState)(!1); // Modal Perfil
  let[nI,sNI]=(0,b.useState)(""); // Nombre Input
  let[pI,sPI]=(0,b.useState)(""); // Pass Input

  const getClean=(v,k)=>{let val=v||localStorage.getItem(k);return (val==="undefined"||val==="null")?null:val};
  const _role=getClean(t,"r"),_name=getClean(n,"n"),_id=getClean(id_u,"u");
  
  (0,b.useEffect)(()=>{
    fetch("/averia").then(res=>res.json()).then(data=>setAvs(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reparador:x.reparador}))));
    fetch("/averia/tecnicos").then(res=>res.json()).then(res=>{stk(res);if(!_id&&_name){let me=res.find(tk=>tk.nombre===_name);if(me){localStorage.setItem("u",me.id);window.location.reload()}}});
  },[]);

  let[flt,sflt]=(0,b.useState)({estado:"",tecnico:"",prioridad:"",busqueda:""});
  const mF=o=>sflt(p=>({...p,[o.target.name]:o.target.value}));
  const mV=id=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");setAvs(p=>p.map(x=>x.id===id?{...x,verificada:!0}:x))}} )};
  const mC=(id,f,v)=>{
    let url="/averia/"+id+"/"+(f=="asignadoA"?"tecnico":f), body=f=="asignadoA"?{tecnicoId:parseInt(v)}:{[f]:v.toUpperCase().replace(/-/g,"_")};
    fetch(url,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(res=>{if(res.ok)setAvs(p=>p.map(x=>x.id===id?{...x,[f]:v}:x))});
  };
  const is_a=/admin/i.test(_role||"");
  const filtered=avs.filter(x=>{
    const b=flt.busqueda.toLowerCase(), matchB=!b||x.titulo.toLowerCase().includes(b)||x.ubicacion.toLowerCase().includes(b)||x.descripcion.toLowerCase().includes(b);
    const matchE=!flt.estado||x.estado==flt.estado, matchT=!flt.tecnico||x.asignadoA==flt.tecnico, matchP=!flt.prioridad||x.prioridad==flt.prioridad;
    const common=matchB&&matchE&&matchT&&matchP;
    if(is_a)return common&&(vm=="pendientes"?!x.verificada:x.verificada);
    const isMine=(_id&&x.asignadoA==_id)||(_name&&x.reparador&&x.reparador.nombre===_name);
    if(vm==="terminadas")return common&&x.verificada&&isMine&&x.estado==="terminada";
    return common&&x.verificada&&isMine&&x.estado!=="terminada";
  });

  const el = b.createElement;

  return el("section", { className: "seccion-vista active seccion-amplia" }, [
    el("div", { className: "contenedor-admin", style: { padding: "1rem 0" } }, [
      el("div", { className: "cabecera-vista" }, 
        el("button", { onClick: () => e("bienvenida"), className: "boton-volver" }, [
          el("span", { className: "icon-exit" }), " Cerrar Sesión / Volver"
        ])
      ),
      el("div", { className: "cabecera-panel-doble", style: { display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" } }, [
        el("div", { className: "cabecera-superior", style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, [
          el("div", { className: "flex-centrado", style: { display: "flex", alignItems: "center", gap: "1rem" } }, [
            el("div", { className: "contenedor-logo" }, el("img", { src: "/logo-silverfish.png", className: "imagen-logo" })),
            el("div", { className: "contenedor-titulo" }, [
              el("h2", { className: "texto-titulo", style: { marginBottom: ".2rem" } }, is_a ? "Gestión de Averías" : "Mis Averías Asignadas"),
              el("p", { className: "text-light texto-subtitulo", style: { margin: 0 } }, is_a ? "Bienvenido, Equipo Coordinador" : "Listado de tareas")
            ])
          ]),
          el("div", { className: "contenedor-acciones-derecha", style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } }, 
            el("div", { className: "panel-usuario-cabecera", style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", padding: "1rem 1.5rem", backgroundColor: "#f8f9fa", borderRadius: "12px", border: "1px solid #E1E5F2", minWidth: "350px" } }, [
              el("div", { style: { display: "flex", flexDirection: "column" } }, [
                el("span", { style: { fontWeight: "bold", fontSize: "1.05rem", color: "#333", lineHeight: "1.2", whiteSpace: "nowrap" } }, _name || "Usuario"),
                el("span", { style: { fontSize: ".85rem", color: "#64748b" } }, ["Rol: ", is_a ? "Administrador" : "Técnico"])
              ]),
              el("button", { className: "boton boton-secundario", style: { marginTop: 0, padding: ".55rem 1.4rem", fontSize: ".85rem", whiteSpace: "nowrap", borderRadius: "12px" }, onClick: () => { sNI(_name||""); sPI(""); sMP(!0); } }, "MODIFICAR PERFIL")
            ])
          )
        ]),
        el("div", { className: "cabecera-inferior", style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "2rem" } }, [
          el("div", { className: "caja-busqueda caja-busqueda-ancha", style: { margin: 0, flex: 1, maxWidth: "600px", position: "relative" } }, [
            el("span", { className: "icon-search", style: { position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", opacity: 0.6, fontSize: "20px" } }),
            el("input", { name: "busqueda", onChange: mF, className: "control-formulario", style: { width: "100%", paddingLeft: "3.5rem", paddingRight: "1.5rem", borderRadius: "50px", backgroundColor: "white", border: "1px solid #d1d5db", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }, placeholder: "Buscar por nombre, aula, estado..." })
          ]),
          el("div", { className: "botones-header", style: { display: "flex", gap: ".75rem", flexShrink: 0 } }, [
            el("button", { onClick: () => svm("pendientes"), className: "boton " + (vm == "pendientes" ? "boton-principal" : "boton-secundario") + " boton-header", style: { marginTop: 0 } }, is_a ? "Pendientes" : "Bandeja Entrada"),
            el("button", { onClick: () => svm(is_a ? "publicadas" : "terminadas"), className: "boton " + (vm == (is_a ? "publicadas" : "terminadas") ? "boton-principal" : "boton-secundario") + " boton-header", style: { marginTop: 0 } }, is_a ? "Publicadas" : "Terminadas"),
            is_a && el(x.Fragment, null, [
              el("button", { onClick: () => e("usuarios-averias"), className: "boton boton-secundario boton-header", style: { marginTop: 0 } }, "Usuarios"),
              el("button", { onClick: () => e("vista-comunicar"), className: "boton boton-secundario boton-header", style: { marginTop: 0 } }, "+ Crear Avería"),
              el("button", { onClick: () => e("crear-usuario"), className: "boton boton-secundario boton-header", style: { marginTop: 0 } }, "+ Crear Usuario")
            ])
          ])
        ])
      ]),
      el("div", { className: "filtros-barra-admin" }, [
        el("span", { className: "filtros-label" }, "Filtrar por:"),
        el("select", { name: "estado", onChange: mF, className: "control-formulario select-sm select-filtro" }, [
          el("option", { value: "" }, "Todos los Estados"), 
          el("option", { value: "sin-empezar" }, "Sin empezar"), 
          el("option", { value: "en-reparacion" }, "En reparación"), 
          el("option", { value: "terminada" }, "Terminada")
        ]),
        is_a && el(x.Fragment, null, [
          el("select", { name: "tecnico", onChange: mF, className: "control-formulario select-sm select-filtro" }, [
            el("option", { value: "" }, "Todos los Técnicos"),
            tks.map(tk => el("option", { key: tk.id, value: tk.id }, tk.nombre))
          ]),
          el("select", { name: "prioridad", onChange: mF, className: "control-formulario select-sm select-filtro" }, [
            el("option", { value: "" }, "Todas las Prioridades"), el("option", { value: "critica" }, "Crítica"), el("option", { value: "menor" }, "Menor"), el("option", { value: "acumulable" }, "Acumulable")
          ])
        ])
      ]),
      el("div", { className: "lista-averias lista-averias-margin" }, 
        filtered.length === 0 ? el("div", { style: { padding: "2rem", textAlign: "center", color: "#64748b" } }, [
          el("p", null, "No hay averías en esta bandeja."),
          el("p", { style: { fontSize: ".7rem" } }, ["(ID detectado: ", _id || "ninguno", ")"])
        ]) : filtered.map(a => el("div", { key: a.id, className: "tarjeta-averia priority-" + a.prioridad }, [
          el("div", { className: "cabecera-averia" }, [
            el("div", null, [
              el("h3", { className: "titulo-averia" }, a.titulo),
              el("div", { className: "meta-averia" }, [ el("span", null, a.categoria), " • ", el("span", null, a.ubicacion) ])
            ]),
            el("span", { className: "distintivo distintivo-estado " + (a.estado !== "sin-empezar" ? a.estado : "") }, a.estado),
            is_a && !a.verificada && el("button", { onClick: () => mV(a.id), style: { marginLeft: '1rem', padding: '0.4rem 1rem', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' } }, "CREAR / PUBLICAR")
          ]),
          el("p", { className: "text-light" }, a.descripcion),
          el("div", { className: "acciones-averia" }, [
            is_a ? el(x.Fragment, null, [
              el("div", null, [
                el("label", { className: "etiqueta-formulario label-sm" }, "Prioridad"),
                el("select", { className: "control-formulario select-sm", value: a.prioridad, onChange: o => mC(a.id, "prioridad", o.target.value) }, [
                  el("option", { value: "critica" }, "Crítica"), el("option", { value: "menor" }, "Menor"), el("option", { value: "acumulable" }, "Acumulable")
                ])
              ]),
              el("div", null, [
                el("label", { className: "etiqueta-formulario label-sm" }, "Asignado a"),
                el("select", { className: "control-formulario select-sm", value: a.asignadoA || "", onChange: o => mC(a.id, "asignadoA", o.target.value) }, [
                  el("option", { value: "" }, "Sin asignar"),
                  tks.map(tk => el("option", { key: tk.id, value: tk.id }, tk.nombre))
                ])
              ])
            ]) : el(x.Fragment, null, [
              el("div", { style: { opacity: 0.7 } }, [
                el("label", { className: "etiqueta-formulario label-sm" }, "Prioridad"),
                el("div", { className: "valor-estatico" }, a.prioridad.toUpperCase())
              ]),
              el("div", { style: { opacity: 0.7 } }, [
                el("label", { className: "etiqueta-formulario label-sm" }, "Asignado a"),
                el("div", { className: "valor-estatico" }, tks.find(tk => tk.id == a.asignadoA)?.nombre || "Tú")
              ])
            ]),
            el("div", { className: "columna-doble" }, [
              el("label", { className: "etiqueta-formulario label-sm" }, "Estado Operativo"),
              el("select", { className: "control-formulario select-sm", value: a.estado, onChange: o => mC(a.id, "estado", o.target.value), disabled: a.estado == "terminada" && !is_a }, [
                el("option", { value: "sin-empezar" }, "Sin empezar"), el("option", { value: "en-reparacion" }, "En reparación"), el("option", { value: "terminada" }, "Terminada")
              ])
            ])
          ])
        ]))
      )
    ]),
    mP && el("div", { style: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,39,40,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" } }, 
      el("div", { className: "tarjeta", style: { width: "450px", maxWidth: "90%", padding: "2.5rem" } }, [
        el("h2", { style: { marginBottom: "1.5rem", textAlign: "center" } }, "Modificar Perfil"),
        el("form", { onSubmit: (e) => {
          e.preventDefault();
          if (_id) {
            fetch(`/user/${_id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nombre: nI, password: pI || undefined })
            })
            .then(res => {
              if (!res.ok) throw new Error("Error al actualizar");
              localStorage.setItem("n", nI);
              if (r) r(nI);
              sMP(!1);
              window.location.reload();
            })
            .catch(err => alert(err.message));
          } else {
            alert("Error: ID de usuario no detectado. Reintente en unos segundos.");
          }
        }}, [
          el("div", { className: "grupo-formulario" }, [
            el("label", { className: "etiqueta-formulario" }, "Nombre de Usuario"),
            el("input", { className: "control-formulario", value: nI, onChange: e => sNI(e.target.value), required: true })
          ]),
          el("div", { className: "grupo-formulario" }, [
            el("label", { className: "etiqueta-formulario" }, "Nueva Contraseña"),
            el("input", { className: "control-formulario", type: "password", value: pI, onChange: e => sPI(e.target.value), placeholder: "En blanco para omitir" })
          ]),
          el("div", { style: { display: "flex", gap: "1rem", marginTop: "2rem" } }, [
            el("button", { type: "button", className: "boton boton-secundario", style: { marginTop: 0 }, onClick: () => sMP(!1) }, "Cancelar"),
            el("button", { type: "submit", className: "boton boton-principal", style: { marginTop: 0 } }, "Aplicar")
          ])
        ])
      ])
    )
  ]);
}
