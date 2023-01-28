const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const dotenv = require('dotenv');

dotenv.config();

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
});

const development = {
  name: 'development',
  asset_path: '/assets',
  session_cookie_key: 'ssshhhhitssecret',
  db: 'socialbuzz_development',
  smtp: {
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'socialbuzz140',
      pass: 'zljyobnojfjvfksj',
    },
  },
  google_client_id:
    '945184551747-95e2jup16ie53og9b3heevuu33i8f1k1.apps.googleusercontent.com',
  google_client_secret: 'jN2zGrDUTt6r6e1tPTPFIVoO',
  google_call_back_url: 'http://localhost:8000/users/auth/google/callback',
  morgan: {
    mode: 'dev',
    options: { stream: accessLogStream },
  },
};

const production = {
  name: 'production',
  asset_path: process.env.SOCIALBUZZ_ASSET_PATH,
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db: process.env.DB,
  smtp: {
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_ADDRESS,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  },
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.GOOGLE_CALL_BACK_URL,
  morgan: {
    mode: 'combined',
    options: { stream: accessLogStream },
  },
};

// module.exports =
//   eval(process.env.SOCIALBUZZ_ENVIRONMENT) == undefined
//     ? development
//     : eval(process.env.SOCIALBUZZ_ENVIRONMENT);

module.exports = production;
