const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const userController = require('../controllers/UserController');
const ItemRegistValidator = require('../validators/userRegistValidator');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'post_db',
});

con.connect(function (err) {
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
  const sql = 'select * from users';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
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
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/failure',
    successRedirect: '/success',
  })
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(
  new LocalStrategy((email, password, done) => {
    const sql = 'select * from users';
    con.query(sql, function (err, result, fields) {
      const currentUser = result.filter((value) => {
        return value.email === email;
      });
      console.log(currentUser);
      console.log(currentUser.length);
      if (currentUser.length === 0) {
        // Error
        return done(null, false);
      } else if (email !== currentUser[0].email) {
        // Error
        return done(null, false);
      } else if (password !== currentUser[0].password) {
        // Error
        return done(null, false);
      } else {
        // Success and return user information.
        return done(null, {
          username: currentUser[0].name,
          password: password,
          email: email,
        });
      }
    });
  })
);
router.get('/', userController.doGetUser);
router.post('/', ItemRegistValidator ,userController.doPostUser);
router.get('/register', userController.doGetRegistar);
router.get('/post', userController.doGetLogin);
router.get('/success', userController.doGetSuccess);
router.get('/failure', userController.doGetFailure);
router.get('/bord', userController.doGetBord);
router.post('/logout', userController.doPostLogout);

module.exports = router;
