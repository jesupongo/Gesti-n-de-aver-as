const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("SURGERY: LOGIN ID RECOVERY...");

// 1. Re-apply V4 ULTIMATE (Style + Basic Logic)
// (I'll do it all in one go here for safety)
const ne_content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/ne_new.js', 'utf8');
const ie_content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/ie_new.js', 'utf8');

let ne_start = content.indexOf('function ne({');
let ie_start = content.indexOf('function ie({');
let ae_start = content.indexOf('function ae({');

content = content.substring(0, ne_start) + ne_content + content.substring(ie_start, ie_start) + ie_content + content.substring(ae_start);

// 2. Identity States in oe (App)
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,t_v]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[n,r_s]=(0,b.useState)(localStorage.getItem(`r`)),[i,a_s]=(0,b.useState)(localStorage.getItem(`n`)||``),[u,u_s]=(0,b.useState)(localStorage.getItem(`u`))');
content = content.replace('t(e),n&&window.history.pushState({viewId:e},``,``)', 't_v(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');

// 3. iniciarSesionComo Definition
content = content.replace('iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})', 'iniciarSesionComo:(_r,_n,_u)=>{localStorage.setItem(`r`,_r),localStorage.setItem(`n`,_n),localStorage.setItem(`u`,_u),r_s(_r),a_s(_n),u_s(_u),o(_r===`personal`?`panel-personal`:`panel-admin`)}})');

// 4. Component Calls with Prop mappings
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a_s})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rol_u:n,nom_u:i,id_u:u,up:a_s})');
content = content.replace('e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n})', 'e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n})');

// 5. THE MISSING LINK: Patch the Acceso (Login) call site
// Finding: if(a.success){o(a.user.rol,a.user.nombre)}
// Note: Variable labels in minified code might vary, but in the previous extract it was likely data or 'a' or 't'.
// I'll use a regex to match the login success branch.
content = content.replace(/if\(([^.]+)\.success\)\{o\(([^,]+)\.user\.rol,([^,]+)\.user\.nombre\)\}/, 'if($1.success){o($1.user.rol,$1.user.nombre,$1.user.id)}');

fs.writeFileSync(path, content);
console.log("LOGIN ID RECOVERY COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
