const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:8000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
  res.send({ message: 'Google Calendar API Ready 🗓️' });
});

app.use('/api/calendar', require('./routes/googleCalendar'));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
