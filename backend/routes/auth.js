import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const router = express.Router();

const generateAccessToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            email: user.email 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' }
    );
};

//AUTH LOGIN/SIGNUP
//1. SIGNUP
router.post('/signup', async (req,res) => {
    const {username, email, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({message: 'Username/Password required'});
    }

    const checkSql = 'SELECT * FROM users WHERE username = ?'
    
    db.query(checkSql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Database Error" });
        }

        if (results.length > 0) {
            return res.status(409).send({
                success: false,
                message: "Username already exists!"
            });
        }

        try {   
            const hashedPass = await bcrypt.hash(password, 10);
            const insertSQL = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 0)';

            db.query(insertSQL, [username, email, hashedPass], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: "Error registering user" });
                }

                const token = generateAccessToken(newUser);
                
                res.status(201).send({
                    success: true,
                    message: 'User registered successfully',
                    user: { id: result.insertId, username: username, email: email },
                    token: token
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error hashing password' });
        }
    });
});

//2. Login (normal)
router.post('/login', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    const checkUserSql = 'SELECT * FROM  users where username = ?';
    db.query(checkUserSql, [username],async (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            return res.status(401).send({message: 'invalid Username/Password'});
        } 

        const  user = results[0];
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = generateAccessToken(user);
            res.send({
                success: true,
                message: 'login sucessful',
                user: {id: user.id, username: user.username, email: user.email },
                token: token
            });
        } else {
            res.status(400).send({message : 'invalid user/password'});
        }
    });
});

//3. Login (Google)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    const username = profile.displayName;
    const token_id = profile.id

    // A. Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
            return done(null,results[0])
        } else {
            // User is new
            const sql = 'INSERT INTO users (username, email, password, id_token) VALUES (?, ?, ?, ?)';
            db.query(sql, [username, email, null, token_id], (err, result) => {
                if (err) return done(err);
                const newUser = { id: result.insertId, username: username, email: email, id_token: token_id};
                return done(null, newUser);
            });
        }
    });
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
  function(req, res) {
    res.redirect(`http://localhost:3000?username=${encodeURIComponent(req.user.username)}`);
  }
);

export default router;