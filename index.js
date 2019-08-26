const express = require('express');
const routes = require('./routes');
const path = require('path');//vai permitir acessar folders e arquivos
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// importar as variaveis
require('dotenv').config({ path: 'variables.env' });

// helpers com algumas func
const helpers = require('./helpers');

// criar a conexão com BD
const db= require('./config/db');

// importar o modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
  .then(() => console.log('conectado ao servidor'))
  .catch(error => console.log(error));

//criar uma app de express - servidor de node
const app = express();

// de onde carregar arquivos estáticos - css, img do public
app.use(express.static('public'));

// habilitar PUG
app.set('view engine', 'pug');

// habilitar bodyParser p ler dados do form
app.use(bodyParser.urlencoded({extended:true}));

// adicionar express validator p toda a app 
app.use(expressValidator());

// adicionar folder vistas
app.set('views', path.join(__dirname, './views'));// __dirname onde estamos agora

// agregar flash msg
app.use(flash());

app.use(cookieParser());

// sessão nos permite navegar por pags diferentes sem ter q autenticar novamente
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// passar var dump p app 
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;//res.locals permite usar vardump em qq outro arquivo 
  res.locals.mensajes = req.flash();
  res.locals.usuario = {...req.user} || null;
  

  next();
});


app.use('/', routes())

// servidor e porto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log('Servidor funcionando');
});
