// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
require('dotenv').config();

const app = express();

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/callback',
  scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/login', passport.authenticate('discord'));
app.get('/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard.html')
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/api/user', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});

app.listen(3000, () => {
  console.log('Dashboard running on http://localhost:3000');
});
const fs = require('fs');
const settingsPath = './settings.js';
let settingsStore = require(settingsPath);

app.get('/api/settings', (req, res) => {
  res.json(settingsStore);
});

app.post('/api/settings', express.json(), (req, res) => {
  settingsStore = {
    kick: req.body.kick,
    ban: req.body.ban,
    warn: req.body.warn
  };
  fs.writeFileSync(settingsPath, `module.exports = ${JSON.stringify(settingsStore, null, 2)}`);
  res.sendStatus(200);
});

