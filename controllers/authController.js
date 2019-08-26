const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Os dois campos devem ser preenchidos'
});

// funcão para verificar se ousuario está logado ou Não
exports.usuarioAutenticado = async (req, res, next) => {
  // seguir adiante se usuario estiver autenticado
  if(req.isAuthenticated()) {
    return next();//está td ok
  }
  // se não estiver autenticado, redirecionar p formulario
  return res.redirect('/iniciar-sesion');
}

// função para cerrar sessão
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');// leva p login
  })
}

// gera token se o usuario for válido  
exports.enviarToken = async (req, res) => {
  //verificar se usuario existe 
  const {email} = req.body
  const usuario = await Usuarios.findOne({where: {email}})

  // se o usuario não existe  
  if(!usuario) {
    req.flash('error', 'Essa conta não existe!');
    res.redirect('/reestablecer');
  }

  // usuario existe  
  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 36000000;
  
  // guardar na base de dados  
  await usuario.save();

  // url para reset na senha  
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // enviar email com o token 
  await enviarEmail.enviar({ 
    usuario,
    subject: "Nova Senha",
    resetUrl,
    archivo: 'reestablecer-password' 
  });
  // terminar
  req.flash('correcto', 'Enviamos um email a você')
  res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  });

  // se não encontrar o usuario  
  if(!usuario) {
    req.flash('error', 'Não válido!');
    res.redirect('/reestablecer');
  }
  
  // formulario para gerar senha  
  res.render('resetPassword', {
    nombrePagina: 'Nova Senha'
  })
}

// troca a senha antiga por uma nova  
exports.actualizarPassword = async(req, res) => {
  // verificar se o token é valido e tb a data de expiração
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte] : Date.now()
      } 
    }
  });
  // verificar se usuario existe 
  if(!usuario) {
    req.flash('error', 'Não válido!');
    res.redirect('/reestablecer');
  }
  // hash na nova senha  
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // guardamos a nova senha  
  await usuario.save();
  
  req.flash('correcto', 'Sua senha foi alterada com sucesso!')
  res.redirect('/iniciar-sesion');
}