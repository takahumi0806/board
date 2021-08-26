const mysql = require('mysql');

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