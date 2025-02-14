const express = require('express')
const app = express()
const port = 8005
const db = require('./config/db')
const passport = require('passport');
const jwtPassport = require('./config/passport_jwt');
const session = require('express-session');


app.use(session({
    name: "hello",
    secret: "jwt33",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded())



app.use('/api',require('./routes/api/v1/adminRoutes'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))