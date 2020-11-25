const express = require('express');
const app = express();
const api = require('./api/v1/index');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./auth/routes');

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;
const User = require('./auth/models/user');

const functions = require('firebase-functions');

app.use(cookieParser());
app.use(session({
    secret:"my secret",
    resave: true,
    saveUninitialized: true,
    name: 'pokemon-cookie'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,cb) => {
    cb(null,user);
});

passport.deserializeUser((user,cb) => {
    cb(null,user);
});

passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
}, (name,pwd,cb) => {
    User.findOne({ username: name}, (err,user) => {
        if (err) {
            console.error(`could not find ${name} in MongoDB`,error);
        }
        if(user.password !== pwd) {
            console.log(`wrong password for ${name}`);
            cb(null,false);
        }else {
            console.log(`${name} found in MongoDB and authenticated`);
            cb(null,user);
        }
        
    });
}));

const mongoose = require('mongoose');
const connection = mongoose.connection;
app.set('port',process.env.port || 3100);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

app.use(cors());
app.use('/api/v1', api); 
app.use('/auth',auth);
app.use((req,res) => {
    const err = new Error("404 - Page not found");
    err.status = 404;
    res.json({ msg : "404 - Page not found", err:err});
});

// mongoose.connect('mongodb://localhost:27017/ngpokemonsapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://ngpokemonsrv:bmJlc19iiJjB9YPK@ngpokemonsrv.zb6cf.mongodb.net/ngpokemonsapp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

connection.on('error', (err) => { 
    console.error(`connection to MongoDB error : ${err.message}`);
});

connection.once('open', () => {
    console.log('Connected to MongoDB');

    // app.listen(app.get('port'), () => {
    //     console.log(`express server listening on port ${app.get('port')}`);
    // });
});


exports.application = functions.https.onRequest(app);
