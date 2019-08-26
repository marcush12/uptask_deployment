const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Criar conta em Uptask'
  })
}

exports.formIniciarSesion = (req, res) => {
  const {error} = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar Sessão em Uptask',
    error
  })
}

exports.crearCuenta = async (req, res) => {
  // ler dados
  const { email, password } = req.body;

  try {
    // criar o usuario
    await Usuarios.create({
      email,
      password
    });
    // criar uma URL de confirmação
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    // criar o objeto de usuario 
    const usuario = {
      email
    }
    // enviar email  
    await enviarEmail.enviar({ 
      usuario,
      subject: "Confirmar sua conta no UpTask",
      confirmarUrl,
      archivo: 'confirmar-cuenta' 
    });      
    // redirecionar o usuario

    req.flash('correcto', 'Enviamos um email a voce. Confirme sua conta.');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    req.flash('error', error.errors.map(error => error.message));
    res.render('crearCuenta', {
      mensajes: req.flash(),
      nombrePagina: 'Criar conta em Uptask',
      email,
      password
    })
  }
}

exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Nova Senha'
  })
}

// mudar o estado de uma conta (activo)
exports.confirmarCuenta = async (req, res) => {
  //res.json(req.params.correo);//mostra email do novo usuario
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });
  // se o usuario não existe
  if(!usuario) {
    req.flash('error', 'Não válido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Conta ativada com sucesso!');
  res.redirect('/iniciar-sesion');
}