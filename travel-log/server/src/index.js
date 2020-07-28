// imports
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const logs = require('./api/logs');

require('dotenv').config();

const { notFound, errorHandler } = require('./middlewares');

// set up mongoose database connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// starting up app
const app = express();

// use morgan to log our network requests
app.use(morgan('common'));
// use helmet to add/remove secure headers
app.use(helmet());
// use cors for cross origin resource sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
// Body parser middleware for post requests
app.use(express.json());

// on the get request to the / path, we return this
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

// using our logs router to handle requests to api/logs
app.use('/api/logs', logs);

// error handler for 404s, this happens if the route is not defined above.
// We pass along the error code to the next error handler after this
app.use(notFound);

// Note. much like above, we can have a middleware that checks if a token is invalid

// error handler for all response codes
app.use(errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
