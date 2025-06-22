const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN

app.use(cors({
  origin: CLIENT_ORIGIN, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
  res.send({ message: 'Google Calendar API Ready 🗓️' });
});

// app.use('/api/calendar', require('./routes/googleCalendar'));

app.use('/api', require('./routes/googleCalendar'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, HOST, () => console.log(`🚀 @ http://${HOST}:${PORT}`));