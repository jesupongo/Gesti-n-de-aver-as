async function testPost() {
  const payload = {
    nombre: 'TEST SURGERY PERSISTENCE',
    tipo: 'otros',
    ubicacion: 'AULA TEST',
    descripcion: 'Testing if backend persists with reportadorId 5',
    reportadorId: 5
  };
  
  try {
    const res = await fetch('http://localhost:3000/averia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', data);
  } catch (err) {
    console.error('FETCH ERROR:', err.message);
  }
}
testPost();
