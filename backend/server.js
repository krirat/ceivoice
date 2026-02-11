require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // CHANGE THIS to your MySQL username
    password: process.env.DB_PASSWORD, // CHANGE THIS to your MySQL password
    database: process.env.DB_NAME // Ensure this matches your database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

app.get('/api/health', (req, res) => {
    return res.status(200).send({message : 'API OK'})
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.SERVER_PORT}`);
});