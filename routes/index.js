const express = require('express');
const router = express.Router();

const { body } = require('express-validator/check');

// importar o controlador 
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
  // rota para home
  router.get('/', 
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );

  router.get('/nuevo-proyecto', 
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto);

  router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

  // listar proyecto 
  router.get('/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl);

  // atualizar o projeto 
  router.get('/proyectos/editar/:id', 
    authController.usuarioAutenticado,
    proyectosController.formularioEditar);

  router.post('/nuevo-proyecto/:id', 
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto);
  
  // eliminar projeto
  router.delete('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto);

  // tarefas 
  router.post('/proyectos/:url', 
    authController.usuarioAutenticado,
    tareasController.agregarTarea);

  // atualizar tarefa: completo ou incompleto
  router.patch('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea);

  // eliminar tarefa
  router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea);

  // criar conta nova  
const usuariosController = require('../controllers/usuariosController');
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearCuenta);
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  // iniciar sessão 
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  //cerrar sessão
  router.get('/cerrar-sesion', authController.cerrarSesion);

  // reestabelecer senha
  router.get('/reestablecer', usuariosController.formRestablecerPassword);
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.actualizarPassword);

  return router;
}
