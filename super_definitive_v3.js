const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("SURGERY: FINAL OBLITERATION V3...");

// 1. App Level
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,t_v]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[n,r_s]=(0,b.useState)(localStorage.getItem(`r`)),[i,a_s]=(0,b.useState)(localStorage.getItem(`n`)||``),[u,u_s]=(0,b.useState)(localStorage.getItem(`u`))');
content = content.replace('t(e),n&&window.history.pushState({viewId:e},``,``)', 't_v(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');
content = content.replace('iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})', 'iniciarSesionComo:(_r,_n,_u)=>{localStorage.setItem(`r`,_r),localStorage.setItem(`n`,_n),localStorage.setItem(`u`,_u),r_s(_r),a_s(_n),u_s(_u),o(_r===`personal`?`panel-personal`:`panel-admin`)}})');

// 2. Component Calls
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rol_u:n,nom_u:i,id_u:u,up:a_s})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rol_u:n,nom_u:i,id_u:u,up:a_s})');
content = content.replace('e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n})', 'e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rol_u:n})');

// 3. VISTA ADMIN (ne) BLOCK
let ne_start = content.indexOf('function ne({');
let ie_start = content.indexOf('function ie({');

const ne_new = `function ne({navegar:e,rol_u:t,nom_u:n,id_u:id_u,up:r}){
  let[avs,setAvs]=(0,b.useState)([]);
  let[vm,svm]=(0,b.useState)("pendientes");
  let[tks,stk]=(0,b.useState)([]);
  (0,b.useEffect)(()=>{
    fetch("/averia").then(res=>res.json()).then(data=>setAvs(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada}))));
    fetch("/averia/tecnicos").then(res=>res.json()).then(stk);
  },[]);
  let[flt,sflt]=(0,b.useState)({estado:"",tecnico:"",prioridad:"",busqueda:""});
  const mF=e=>sflt(p=>({...p,[e.target.name]:e.target.value}));
  const mV=id=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");setAvs(p=>p.map(x=>x.id===id?{...x,verificada:!0}:x))}} )};
  const mC=(id,f,v)=>{
    let url="/averia/"+id+"/"+(f=="asignadoA"?"tecnico":f), body=f=="asignadoA"?{tecnicoId:parseInt(v)}:{[f]:v.toUpperCase().replace(/-/g,"_")};
    fetch(url,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(res=>{if(res.ok)setAvs(p=>p.map(x=>x.id===id?{...x,[f]:v}:x))});
  };
  const is_a=/admin/i.test(t||"");
  const filtered=avs.filter(x=>{
    const b=flt.busqueda.toLowerCase(), matchB=!b||x.titulo.toLowerCase().includes(b)||x.ubicacion.toLowerCase().includes(b)||x.descripcion.toLowerCase().includes(b);
    const matchE=!flt.estado||x.estado==flt.estado, matchT=!flt.tecnico||x.asignadoA==flt.tecnico, matchP=!flt.prioridad||x.prioridad==flt.prioridad;
    const common=matchB&&matchE&&matchT&&matchP;
    return is_a ? (common && (vm=="pendientes"?!x.verificada:x.verificada)) : (common && x.verificada && x.asignadoA==id_u);
  });
  return (0,x.jsxs)("section",{className:"seccion-vista active seccion-amplia",children:[(0,x.jsxs)("div",{className:"contenedor-admin",style:{padding:"1rem 0"},children:[(0,x.jsx)("div",{className:"cabecera-vista",children:(0,x.jsxs)("button",{onClick:()=>e("bienvenida"),className:"boton-volver",children:[(0,x.jsx)("span",{className:"icon-exit"})," Cerrar Sesión / Volver"]})}),(0,x.jsxs)("div",{className:"cabecera-panel-doble",style:{display:"flex",flexDirection:"column",gap:"1.5rem",marginBottom:"2rem"},children:[(0,x.jsxs)("div",{className:"cabecera-superior",style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,x.jsxs)("div",{className:"flex-centrado",style:{display:"flex",alignItems:"center",gap:"1rem"},children:[(0,x.jsx)("div",{className:"contenedor-logo",children:(0,x.jsx)("img",{src:"/logo-silverfish.png",className:"imagen-logo"})}),(0,x.jsxs)("div",{className:"contenedor-titulo",children:[(0,x.jsx)("h2",{className:"texto-titulo",children:is_a?"Gestión de Averías":"Mis Averías Asignadas"}),(0,x.jsx)("p",{className:"text-light",children:is_a?"Equipo Coordinador":"Listado de tareas"})]})]}),(0,x.jsx)("div",{className:"panel-usuario-cabecera",style:{backgroundColor:"#f8f9fa",padding:"1rem",borderRadius:"8px",minWidth:"300px",border:"1px solid #ddd"},children:(0,x.jsxs)("div",{children:[(0,x.jsx)("div",{style:{fontWeight:"bold"},children:n||"Usuario"}),(0,x.jsxs)("div",{style:{fontSize:".8rem"},children:["Rol: ",is_a?"Administrador":"Técnico"]})]})})]}) , (0,x.jsxs)("div",{className:"cabecera-inferior",style:{display:"flex",marginBottom:"1rem",gap:"1rem"},children:[(0,x.jsx)("input",{name:"busqueda",onChange:mF,className:"control-formulario",style:{flex:1},placeholder:"Buscar..."}),(0,x.jsxs)("div",{className:"botones-header",style:{display:"flex",gap:".5rem"},children:[is_a&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("button",{onClick:()=>svm("pendientes"),className:"boton "+(vm=="pendientes"?"boton-principal":"boton-secundario"),children:"Pendientes"}),(0,x.jsx)("button",{onClick:()=>svm("publicadas"),className:"boton "+(vm=="publicadas"?"boton-principal":"boton-secundario"),children:"Publicadas"}),(0,x.jsx)("button",{onClick:()=>e("usuarios-averias"),className:"boton boton-secundario",children:"Usuarios"}),(0,x.jsx)("button",{onClick:()=>e("crear-usuario"),className:"boton boton-secundario",children:"+ Crear Usuario"})]})]})]}) , (0,x.jsxs)("div",{className:"lista-averias",children:filtered.map(a=>(0,x.jsxs)("div",{className:"tarjeta-averia priority-"+a.prioridad,children:[(0,x.jsxs)("div",{className:"cabecera-averia",children:[(0,x.jsxs)("div",{children:[(0,x.jsx)("h3",{children:a.titulo}),(0,x.jsxs)("div",{className:"meta-averia",children:[a.categoria," • ",a.ubicacion]})]}),(0,x.jsx)("span",{className:"distintivo",children:a.estado}),is_a&&!a.verificada&&(0,x.jsx)("button",{onClick:()=>mV(a.id),style:{backgroundColor:"#2ecc71",color:"white",padding:".4rem",borderRadius:"4px",border:"none",fontWeight:"bold",cursor:"pointer"},children:"CREAR / PUBLICAR"})]}),(0,x.jsx)("p",{className:"text-light",children:a.descripcion}),(0,x.jsxs)("div",{className:"acciones-averia",children:[is_a?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)("div",{children:[(0,x.jsx)("label",{children:"Prioridad"}),(0,x.jsxs)("select",{value:a.prioridad,onChange:e=>mC(a.id,"prioridad",e.target.value),className:"control-formulario",children:[(0,x.jsx)("option",{value:"critica",children:"Crítica"}),(0,x.jsx)("option",{value:"menor",children:"Menor"}),(0,x.jsx)("option",{value:"acumulable",children:"Acumulable"})]})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)("label",{children:"Asignado"}),(0,x.jsxs)("select",{value:a.asignadoA||"",onChange:e=>mC(a.id,"asignadoA",e.target.value),className:"control-formulario",children:[(0,x.jsx)("option",{value:"",children:"Sin asignar"}),tks.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre},t.id))]})]})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)("div",{children:[(0,x.jsx)("label",{children:"Prioridad"}),(0,x.jsx)("div",{children:a.prioridad.toUpperCase()})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)("label",{children:"Asignado"}),(0,x.jsx)("div",{children:tks.find(t=>t.id==a.asignadoA)?.nombre||"Tú"})]})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)("label",{children:"Estado"}),(0,x.jsxs)("select",{value:a.estado,onChange:e=>mC(a.id,"estado",e.target.value),className:"control-formulario",disabled:a.estado=="terminada"&&!is_a,children:[(0,x.jsx)("option",{value:"sin-empezar",children:"Sin empezar"}),(0,x.jsx)("option",{value:"en-reparacion",children:"En reparación"}),(0,x.jsx)("option",{value:"terminada",children:"Terminada"})]})]})]})]},a.id))})]})]})}`;
// Removed the extra } at the end.

// 4. VISTA USUARIOS (ie) BLOCK REPLACEMENT
// Signature: function ie({navegar:e,rol_u:t})
const ie_new = `function ie({navegar:e,rol_u:t}){
  let[n,r]=(0,b.useState)("");
  let[i,a]=(0,b.useState)([]);
  (0,b.useEffect)(()=>{
    fetch("/user").then(res=>res.json()).then(data=>{a(data.map(u=>({id:u.id,nombre:u.nombre,rol:u.rol,correo:u.email,averiasComunicadas:[]})))})
  },[]);
  const is_a=/admin/i.test(t||"");
  const filtered=i.filter(u=>u.nombre.toLowerCase().includes(n.toLowerCase())||u.correo.toLowerCase().includes(n.toLowerCase()));
  return !is_a ? (0,x.jsx)("div",{children:"Acceso Denegado"}) : (0,x.jsxs)("section",{className:"seccion-vista active seccion-amplia",children:[(0,x.jsxs)("div",{className:"tarjeta tarjeta-amplia",children:[(0,x.jsx)("div",{className:"cabecera-vista",children:(0,x.jsxs)("button",{onClick:()=>e("panel-admin"),className:"boton-volver",children:[(0,x.jsx)("span",{className:"icon-arrow-left2"})," Volver al Panel Admin"]})}),(0,x.jsxs)("div",{className:"cabecera-panel cabecera-panel-margin",children:[(0,x.jsxs)("div",{className:"flex-centrado",children:[(0,x.jsx)("div",{className:"contenedor-logo",children:(0,x.jsx)("img",{src:"/logo-silverfish.png",className:"imagen-logo"})}),(0,x.jsxs)("div",{className:"contenedor-titulo",children:[(0,x.jsx)("h2",{className:"texto-titulo",children:"Usuarios y Averías"}),(0,x.jsx)("p",{className:"text-light",children:"Listado completo"})]})]}),(0,x.jsxs)("div",{className:"caja-busqueda",children:[(0,x.jsx)("span",{className:"icon-search"}),(0,x.jsx)("input",{value:n,onChange:e=>r(e.target.value),className:"control-formulario",placeholder:"Buscar usuario..."})]})]}) , (0,x.jsx)("div",{className:"lista-usuarios",children:filtered.map(u=>(0,x.jsxs)("div",{className:"tarjeta",style:{marginBottom:"1rem",padding:"1.5rem"},children:[(0,x.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,x.jsxs)("div",{children:[(0,x.jsx)("h3",{children:u.nombre}),(0,x.jsxs)("div",{style:{fontSize:".8rem",color:"#64748b"},children:[u.rol," • ",u.correo]})]}),(0,x.jsx)("button",{className:"boton boton-secundario",children:"MODIFICAR"})]}),(0,x.jsx)("div",{style:{marginTop:"1rem",paddingTop:"1rem",borderTop:"1px solid #eee",color:"#64748b",fontSize:".9rem"},children:"Historial de averías disponible en la base de datos."})]},u.id))})]})]})}`;

// Apply the replacement
content = content.substring(0, ne_start) + ne_new + content.substring(ie_start, ie_start) + ie_new + content.substring(content.indexOf('function ae({'));

fs.writeFileSync(path, content);
console.log("FINAL OBLITERATION V3 COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
