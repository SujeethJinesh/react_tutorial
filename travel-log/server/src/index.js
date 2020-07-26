// imports
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// starting up app
const app = express();

// use morgan to log our network requests
app.use(morgan('common'));
// use helmet to add/remove secure headers
app.use(helmet());
// use cors for cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

// on the get request to the / path, we return this
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

// error handler for 404s, this happens if the route is not defined above.
// We pass along the error code to the next error handler after this
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Note. much like above, we can have a middleware that checks if a token is invalid

// error handler for all response codes
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
