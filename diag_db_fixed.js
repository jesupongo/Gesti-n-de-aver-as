const { Client } = require('pg');
const client = new Client({ 
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'SilverfishPassword',
    database: 'GestionDeAverias'
});

async function check() {
    try {
        await client.connect();
        const res = await client.query('SELECT id, nombre, \"reportadorId\", verificada FROM averia');
        console.log('Averias in DB:', res.rows);
        
        const users = await client.query('SELECT id, nombre, rol FROM \"user\"');
        console.log('Users in DB:', users.rows);
    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        await client.end();
    }
}
check();
