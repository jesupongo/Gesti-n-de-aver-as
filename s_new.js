function S({navegar:e,iniciarSesionComo:t}){
  let[n,r]=(0,b.useState)(!1);
  return(0,x.jsx)(`section`,{className:`seccion-vista active`,children:(0,x.jsxs)(`div`,{className:`tarjeta`,children:[
    (0,x.jsx)(`div`,{className:`cabecera-vista cabecera-login-ajuste`,children:(0,x.jsxs)(`button`,{type:`button`,onClick:()=>e(`bienvenida`),className:`boton-volver`,children:[(0,x.jsx)(`span`,{className:`icon-arrow-left2`}),` Atrás`]})}),
    (0,x.jsxs)(`form`,{onSubmit:event=>{
      event.preventDefault();
      let usr=event.target.elements.usuario?.value;
      let pw=event.target.elements.password?.value;
      r(!0);
      fetch("/user/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:usr,password:pw})})
      .then(res=>{if(!res.ok)throw new Error(); return res.json()})
      .then(data=>{
         r(!1);
         const role = data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal";
         t(role, data.user.nombre, data.user.id);
      })
      .catch(err=>{r(!1); alert("Credenciales incorrectas")});
    },children:[
      (0,x.jsxs)(`div`,{className:`grupo-formulario`,children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario`,htmlFor:`usuario`,children:`Usuario o Correo`}),(0,x.jsx)(`input`,{type:`text`,id:`usuario`,className:`control-formulario`,placeholder:`Ej: profesor@colegio.edu`,required:!0})]}),
      (0,x.jsxs)(`div`,{className:`grupo-formulario`,children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario`,htmlFor:`password`,children:`Contraseña`}),(0,x.jsx)(`input`,{type:`password`,id:`password`,className:`control-formulario`,placeholder:`••••••••`,required:!0})]}),
      (0,x.jsx)(`button`,{type:`submit`,className:`boton boton-principal`,disabled:n,children:n?`Verificando...`:`Iniciar Sesión`})
    ]})
  ]})})}
