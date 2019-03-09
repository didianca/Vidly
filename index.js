require('express-async-errors');

const winston= require('winston');
require('winston-mongodb');
const error= require('./middleware/error');
const config = require('config');
const express = require('express');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const app = express();

if(!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: myPrivateKey is not defined.');
  process.exit(1); //code 0 means success, giving it anything else --> 1 in this case <-- will terminate the process
}

//Connect to MongoDB
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(()=> console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/customers',customers);
app.use('/api/genres', genres);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use(error);

app.get('/',(req,res)=>{
  res.send('Hello World! This is Didi learning Express ^^!!!');
});


//PORT
const port =  process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}..`));
