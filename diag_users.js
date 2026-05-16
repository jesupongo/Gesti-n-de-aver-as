const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'averias',
    password: 'postgres',
    port: 5433
});

client.connect()
    .then(() => client.query('SELECT id, nombre, email, rol FROM "user"'))
    .then(res => {
        console.log("USERS IN DB:");
        console.log(JSON.stringify(res.rows, null, 2));
        return client.query('SELECT id, nombre, verificada FROM "averia"');
    })
    .then(res => {
        console.log("AVERIAS IN DB:");
        console.log(JSON.stringify(res.rows, null, 2));
        client.end();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
