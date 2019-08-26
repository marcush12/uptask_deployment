const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');

exports.proyectosHome = async (req, res) => {

  //console.log(res.locals.usuario);

  const usuarioId = res.locals.usuario.id; 
  const proyectos = await Proyectos.findAll({where: {usuarioId}});// como SELECT * from

  res.render('index', {
    nombrePagina: 'Projetos',
    proyectos 
  });// render vai imprimir html
}

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id; 
  const proyectos = await Proyectos.findAll({where: {usuarioId}})
  res.render('nuevoProyecto', {
    nombrePagina: 'Novo Projeto',
    proyectos
  })
}

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id; 
  const proyectos = await Proyectos.findAll({where: {usuarioId}})
  // enviar a console o q usuario escreve
  //console.log(req.body);

  // verificar se campo ñ está vazio
  const { nombre } = req.body; //destruct

  let errores = [];

  if(!nombre) {
    errores.push({'texto': 'Escreva o nome do projeto'});
  }

  // se há erros 
  if(errores.length > 0 ){
    res.render('nuevoProyecto', {
        nombrePagina : 'Novo Projeto',
        errores,
        proyectos
    })
  } else {
    // sem erros
    // inserir na BD
    const usuarioId = res.locals.usuario.id;
    
    await Proyectos.create({ nombre, usuarioId });
    res.redirect('/');
      
  }
}

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id; 
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}})


  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  })
  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

  // consultar tarefas de projeto atual
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id
    },
    // include: [
    //   { model: Proyectos }
    // ]
  });
  // console.log(tareas);

  if(!proyecto) return next();

  // render vista //
  res.render('tareas', {
    nombrePagina: 'tarefas do Projeto',
    proyecto,
    proyectos,
    tareas
  })
}

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id; 
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}})

  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    }
  })
  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
  // render a vista
  res.render('nuevoProyecto', {
    nombrePagina : 'Editar Projeto', 
    proyectos,
    proyecto
  })
}

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id; 
  const proyectos = await Proyectos.findAll({where: {usuarioId}})
  // enviar a console o q usuario escreve
  //console.log(req.body);

  // verificar se campo ñ está vazio
  const { nombre } = req.body; //destruct

  let errores = [];

  if(!nombre) {
    errores.push({'texto': 'Escreva o nome do projeto'});
  }

  // se há erros 
  if(errores.length > 0 ){
    res.render('nuevoProyecto', {
        nombrePagina : 'Novo Projeto',
        errores,
        proyectos
    })
  } else {
    // sem erros
    // inserir na BD

    
    await Proyectos.update(
      { nombre: nombre },
      { where: {id: req.params.id}}
    );
    res.redirect('/');
      
  }
}

exports.eliminarProyecto = async (req, res, next) => {
  // req, query ou params
  //console.log(query);
  const {urlProyecto} = req.query;
  const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

  if(!resultado) {
    return next();
  }

  res.status(200).send('Projeto Eliminado corretamente!');
}

