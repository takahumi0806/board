const express = require('express')
const app = express()
const port = 3000
const passport = require('passport');
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
}));


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.urlencoded( { extended: false }))
app.use('/', require('./routes/index'));













app.listen(port, () => console.log(`Example app listening on port ${port}!`))