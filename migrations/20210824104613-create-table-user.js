'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('users', {
  id: {type: 'int'},
  name: {type: 'string', allowNull: false},
  email: {type: 'string', allowNull: false, unique: true},
  password: {type: 'string', allowNull: false},
  confirmPassword: {type: 'string', allowNull: false},
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('users');
  return null;
};

exports._meta = {
  "version": 1
};
