const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'GestionDeAverias',
  password: 'SilverfishPassword',
  port: 5433,
});

async function run() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, nombre, verificada, "reportadorId", estado FROM averia ORDER BY id DESC LIMIT 5;');
    console.log('LATEST AVERIAS:');
    console.table(res.rows);
  } catch (err) {
    console.error('DB ERROR:', err.message);
  } finally {
    await client.end();
  }
}
run();
