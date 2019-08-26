const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');


const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Escreva um email válido'
      },
      notEmpty: {
        msg: 'O email não pode ficar em branco'
      }
    },
    unique: {
      args: true,
      msg: 'Usuário já existe'
    }

  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A senha não pode ficar em branco'
      }
    }
  },
  activo: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  token: Sequelize.STRING,
  expiracion: Sequelize.DATE
}, {
  hooks: {
    beforeCreate(usuario) {
      usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
    }
  }
});
// métodos personalizados
Usuarios.prototype.verificarPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;