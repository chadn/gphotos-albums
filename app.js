'use strict';

// [START app]

import bodyParser from 'body-parser';
import express from 'express';
import expressWinston from 'express-winston';
import http from 'http';
import passport from 'passport';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import winston from 'winston';

import {auth} from './auth.js';
import {config} from './config.js';
import routes from './routes.js';
import {fileURLToPath} from 'url';

const app = express();
const fileStore = sessionFileStore(session);
const server = http.Server(app);

// Use the EJS template engine
app.set('view engine', 'ejs');

// Disable browser-side caching for demo purposes.
app.disable('etag');


// Set up OAuth 2.0 authentication through the passport.js library.
auth(passport);

// Set up a session middleware to handle user sessions.
const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  store: new fileStore({}),
  secret: config.sessionSecret,
});

// Console transport for winton.
const consoleTransport = new winston.transports.Console();

// Set up winston logging.
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    consoleTransport
  ]
});

// Enable extensive logging if the DEBUG environment variable is set.
if (process.env.DEBUG) {
  // Print all winston log levels.
  logger.level = 'silly';

  // Enable express.js debugging. This logs all received requests.
  app.use(expressWinston.logger({
    transports: [
          consoleTransport
        ],
        winstonInstance: logger
  }));
  logger.silly('Started with DEBUG log level.');

} else {
  // By default, only print all 'verbose' log level messages or below.
  logger.level = 'verbose';
}


// Set up static routes for hosted libraries.
app.use(express.static('static'));
app.use('/js',
  express.static(
    fileURLToPath(
      new URL('./node_modules/jquery/dist/', import.meta.url)
    ),
  )
);

app.use(
  '/fancybox',
  express.static(
    fileURLToPath(
      new URL('./node_modules/@fancyapps/fancybox/dist/', import.meta.url)
    ),
  )
);
app.use(
  '/mdlite',
  express.static(
    fileURLToPath(
      new URL('./node_modules/material-design-lite/dist/', import.meta.url)
    ),
  )
);


// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({extended: true}));

// Enable user session handling.
app.use(sessionMiddleware);

// Set up passport and session handling.
app.use(passport.initialize());
app.use(passport.session());

// Middleware that adds the user of this session as a local variable,
// so it can be displayed on all pages when logged in.
app.use((req, res, next) => {
  res.locals.name = '-';
  if (req.user && req.user.profile && req.user.profile.name) {
    res.locals.name =
        req.user.profile.name.givenName || req.user.profile.displayName;
  }

  res.locals.avatarUrl = '';
  if (req.user && req.user.profile && req.user.profile.photos) {
    res.locals.avatarUrl = req.user.profile.photos[0].value;
  }
  next();
});


routes.logger = logger
//  Connect all our routes to our application
app.use('/', routes);


// Start the server
server.listen(config.port, () => {
  console.log(`App listening on port ${config.port}, PID=${process.pid}`);
  console.log('To quit, press Ctrl+C, or from another shell: kill '+ process.pid);
});


// [END app]
