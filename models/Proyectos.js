const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

const db = require('../config/db');

const Proyectos = db.define('proyectos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: Sequelize.STRING(100),

  url: Sequelize.STRING(100)
}, {
  hooks:  {//func q corre por um tempo determinado; no caso corre antes de inserir no BD
    beforeCreate(proyecto) {//faz parte d sequlize
      //console.log('antes de inserir no BD');
      const url = slug(proyecto.nombre).toLowerCase();

      proyecto.url = `${url}-${shortid.generate()}`;
    },
  }
})

module.exports = Proyectos;