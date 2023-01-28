const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');

const PORT = process.env.PORT || 8000;

const app = express();
const dotenv = require('dotenv');

dotenv.config();
//require library for layout
const expressLayouts = require('express-ejs-layouts');

//require cookoe parser library
const cookieParser = require('cookie-parser');

//requiring DB
const db = require('./config/mongoose');
const User = require('./models/user');

//session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2strategy');

const MongoStore = require('connect-mongo').default;

const sassMiddleware = require('node-sass-middleware');

//connect-flash
const flash = require('connect-flash');

const customMware = require('./config/middleware');

//SETUP THE CHAT SERVER TO BE USED WITH SOCKET.IO
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on the port 5000');

const path = require('path');

// using node-sass-middleware
// if(env.name=='development'){
// app.use(
//   sassMiddleware({
//     src: path.join(__dirname, env.asset_path, 'scss'),
//     dest: path.join(__dirname, env.asset_path, 'css'),
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css',
//   })
// );
// }

//use layouts in our page
app.use(expressLayouts);

//to read form data
app.use(express.urlencoded({ extended: false }));

//using cookieParser
app.use(cookieParser());

//Extract style and scripts from subpages into layoout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setting up ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    name: 'SocialBuzz',
    //TODO chnage secret before deployment
    secret: env.session_cookie_key,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 20,
    },
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/SocialBuzz_dev',
      autoRemove: 'disabled', // Default
    }),
  })
);

//passport also helps in maintaing session
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//using flash to set flash messages
app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes/index'));

//using static files
app.use(express.static(__dirname + '/assets'));

//make uploads path available in the browsers
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.listen(PORT, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`);
    return;
  }
  console.log(`Server is running fine on the port : ${PORT}`);
  // console.log('Database_URL', process.env.MONGO_URI);
});
