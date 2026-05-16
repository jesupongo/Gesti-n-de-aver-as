const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'GestionDeAverias',
  password: 'SilverfishPassword',
  port: 5433,
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT id, nombre, "reparadorId", verificada FROM averia WHERE id=4');
  console.log('Averia 4:', res.rows);
  const res2 = await client.query('SELECT id, nombre, rol FROM \"user\"');
  console.log('User List:', res2.rows);
  await client.end();
}

run();
