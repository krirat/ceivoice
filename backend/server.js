import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';
import path from 'path';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import ticketRoutes from './routes/tickets.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();
const app = express();

app.use(session({
    secret: 'super_secret_key_change_this',
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Any route in auth.js will now be prefixed with /api/auth
app.use('/api/auth', authRoutes); 

// Any route in ai.js will now be prefixed with /api
app.use('/api', aiRoutes);

app.use('/api/tickets', ticketRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
    return res.status(200).send({message : 'API OK'})
});

const sslOptions = {
    key: fs.readFileSync(path.join(process.cwd(), '../certs/localhost.key')),
    cert: fs.readFileSync(path.join(process.cwd(), '../certs/localhost.crt'))
}

/*app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.SERVER_PORT}`);
}); */

https.createServer(sslOptions, app).listen(process.env.SERVER_PORT, () => {
    console.log(`HTTPS Server is listening at https://localhost:${process.env.SERVER_PORT}`)
})