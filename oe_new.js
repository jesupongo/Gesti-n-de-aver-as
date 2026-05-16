function oe(){
  let[e,t]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),
     [n,r]=(0,b.useState)(localStorage.getItem(`r`)),
     [i,a]=(0,b.useState)(localStorage.getItem(`n`)||``),
     [_uid,_suid]=(0,b.useState)(()=>{
        const val = localStorage.getItem(`u`);
        if(!val || val === "null" || val === "undefined") return null;
        return parseInt(val);
     }),
     o=(viewId,pushState=!0)=>{
         t(viewId);
         localStorage.setItem(`v`,viewId);
         pushState && window.history.pushState({viewId},``,``);
         window.scrollTo({top:0,behavior:`smooth`});
     };
  b.useEffect(()=>{
     let listener=e=>{e.state&&e.state.viewId?o(e.state.viewId,!1):o(`bienvenida`,!1)};
     window.addEventListener(`popstate`,listener);
     window.history.replaceState({viewId:`bienvenida`},``,``);
     return ()=>window.removeEventListener(`popstate`,listener);
  },[]);
  return (0,x.jsxs)(`main`,{id:`app-container`,children:[
     e===`bienvenida`&&(0,x.jsx)(ee,{navegar:o}),
     e===`acceso`&&(0,x.jsx)(S,{navegar:o,iniciarSesionComo:(_r,_n,_id)=>{
         const cleanId = parseInt(_id);
         localStorage.setItem(`r`,_r);
         localStorage.setItem(`n`,_n);
         localStorage.setItem(`u`,cleanId);
         r(_r); a(_n); _suid(cleanId);
         o(_r===`personal`?`panel-personal`:`panel-admin`);
     }}),
     e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o}),
     e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:_uid,actualizarPerfil:a}),
     e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,idUsuario:_uid,nombreUsuario:i,actualizarPerfil:a}),
     e===`crear-usuario`&&(0,x.jsx)(re,{navegar:o}),
     e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n,nombreUsuario:i}),
  ]});
}
