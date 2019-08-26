const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// referencia ao modelo onde vamos autenticar 
const Usuarios = require('../models/Usuarios');

// local strategy - login com credenciais próprias (usuario e password)
passport.use(
  new LocalStrategy(
    //por default passport espera um usuario e senha 
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1
          }
        });
        // usuario existe mas senha está incorreta
        if(!usuario.verificarPassword(password)) {
          return done(null, false, { 
            message: 'Senha incorreta'
          })
        }
        // email existe e password está correto
        return done(null, usuario);//null for error
      } catch (error) {
        // esse usuário n existe
        return done(null, false, { 
          message: 'Essa conta não existe'
        })
      }
    }
  )
);
// serializar o usuario - por  como objeto
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);//null para error
})

// deserializar o usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
})

// exportar
module.exports = passport;





