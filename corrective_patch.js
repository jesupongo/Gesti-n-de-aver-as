const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Starting FINAL CORRECTIVE surgical patch...");

// 1. CREAR button
// Find: children:ee[e.estado]})]
// Note: It's inside a jsxs array. We add the button as an additional element in that array.
const button_target = 'children:ee[e.estado]})]';
const button_replace = 'children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),className:`boton-crear-averia-admin`,style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]';

if (content.includes(button_target)) {
    content = content.replace(button_target, button_replace);
    console.log("Admin button patch APPLIED.");
} else {
    console.log("Admin button target NOT found.");
}

fs.writeFileSync(path, content);
console.log("FINAL CORRECTIVE Surgical patch COMPLETED.");
