const express = require('express');
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000;
const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
        result += i + ' ';
    }
    return result;
}

app.get('/', (req, res) => {
    res.send('Welcome Hello world');
});

app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM test_table');
        const results = { 'results': (result) ? result.rows : null };
        res.render('pages/db', results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/times', (req, res) => res.send(showTimes()))

app.listen(PORT, () => console.log(`Listening on ${PORT}`))