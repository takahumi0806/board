const express = require('express');
const app = express()
const router = express.Router();
const mysql = require('mysql');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken')

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'post_db'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected');
  // データベース作成後に消す
  // con.query('CREATE DATABASE post_db', function (err, result) {
  // if (err) throw err; 
  //   console.log('database created');
  // });
  //テーブル作成後に消す
  // 	const sql = 'CREATE TABLE users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)';
  // 	con.query(sql, function (err, result) {  
  // 	if (err) throw err;  
  // 	console.log('table created');  
  // 	});
  const sql = "select * from users"
	con.query(sql, function (err, result, fields) {  
	if (err) throw err;  
	console.log(result)
	});
});

// con.connect(function(err) {
// 	if (err) throw err;
// 	console.log('Connected');
// 	const sql = 'CREATE TABLE users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)';
// 	con.query(sql, function (err, result) {  
// 	if (err) throw err;  
// 	console.log('table created');  
// 	});
// });

passport.serializeUser((user, done) => {
  console.log('Serialize ...');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserialize ...');
  done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  (email, password, done) => {
    console.log(email)
    const sql = "select * from users"
    con.query(sql, function (err, result, fields) {  
      const currentUser = result.filter((value) => {
        return value.email === email;
      });
      console.log(currentUser)
      console.log(currentUser[0].email)
      console.log(email)
      console.log(currentUser[0].password)
      console.log(password)
      if(email !== currentUser[0].email){
        // Error
        return done(null, false);
      } else if(password !== currentUser[0].password) {
        // Error
        return done(null, false);
      } else {
        // Success and return user information.
        return done(null, { username: currentUser[0].name, password: password, email: email});
      }
    });
  }
));

router.get('/failure', (req, res) => {
  console.log(req.session);
  res.send('Failure');
});

router.get('/success', (req, res) => {
  const token = jwt.sign({name: req.session.passport.user.username, email: req.session.passport.user.email}, 'secret')
  req.session.passport.user['token'] = token
  res.redirect('/login');
});

router.get('/', (req, res) => {
  console.log(req.session);
  res.render('index')
})
router.get('/login', (req, res) => {
  if(req.session.passport === undefined){
    res.redirect('/');
  } else {
    const token = req.session.passport.user.token 
    jwt.verify(token,'secret',(err,user)=>{
      if(err){
        return res.sendStatus(403)
      }else{
        console.log(user)
        console.log(user.name)
        res.render('login',{user: user.name})
      }
    })
  }
})
router.post('/', (req, res) => {
	const sql = "INSERT INTO users SET ?"
	con.query(sql,req.body,function(err, result, fields){
		if (err) throw err;
    const token = jwt.sign({name: req.body.name, email: req.body.email}, 'secret')
		console.log(result);
    console.log(req.body)
		jwt.verify(token,'secret',(err,user)=>{
      if(err){
        return res.sendStatus(403)
      }else{
        console.log(user)
        console.log(user.name)
        res.render('login',{user: user.name})
      }
    })
    
	});
});
router.post('/login',
  passport.authenticate('local',
    {
      failureRedirect : '/failure',
      successRedirect : '/success'
    }
  ),
);

module.exports = router;