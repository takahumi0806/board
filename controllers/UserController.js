const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'post_db',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected');
  const sql = 'select * from users';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

module.exports = {
  doGetUser: (req, res, error) => {
    console.log(req.session);
    // res.render('index');
    res.render('index', {
      errorMessage: ''
    });
  },
  doGetRegistar: (req, res) => {
    res.render ('register', {
      errorMessage: '',
    });
  },
  doPostUser: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsArray = errors.array();
      console.log(errorsArray)
      res.render ('register', {
        errorMessage: errorsArray,
      });
    } else {
      const sql = 'INSERT INTO users SET ?';
      con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        const token = jwt.sign(
          { name: req.body.name, email: req.body.email },
          'secret'
        );
        req.session.passport = { user: { token: token } };
        jwt.verify(token, 'secret', (err, user) => {
          if (err) {
            return res.sendStatus(403);
          } else {
            console.log(user);
            console.log(user.name);
            res.redirect('/post');
          }
        });
      });
    }
  },
  doGetLogin: (req, res) => {
    console.log(req.session.passport);
    if (req.session.passport === undefined) {
      res.redirect('/');
    } else {
      const token = req.session.passport.user.token;
      jwt.verify(token, 'secret', (err, user) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          console.log(user);
          console.log(user.name);
          res.render('post', { user: user.name });
        }
      });
    }
  },
  doGetSuccess: (req, res) => {
    const token = jwt.sign(
      {
        name: req.session.passport.user.username,
        email: req.session.passport.user.email,
      },
      'secret'
    );
    req.session.passport.user['token'] = token;
    res.redirect('/post');
  },
  doGetFailure: (req, res) => {
    const errors = validationResult(req);
    console.log(errors)
    console.log(req.session);
    res.render('index', {
      errorMessage: [{msg: 'パスワードかemailが違います'}]
    })
  },
  doPostLogout: (req, res) => {
    req.session.passport = undefined;
    res.redirect('/');
  },
  doGetBord: (req, res) => {
    console.log(req.session.passport);
    if (req.session.passport === undefined) {
      res.redirect('/');
    } else {
      console.log('bord');
      res.render('bord', {
         user: req.session.passport.user.username 
      });
    }
  },
};
