const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const movies = require('./routes/movies');
const app = express();
const mongoose = require('mongoose');

//Connect to MongoDB
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err=> console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);

app.get('/',(req,res)=>{
  res.send('Hello World! This is Didi learning Express ^^!!!');
});


//PORT
const port =  process.env.PORT || 3000;
app.listen(3000,() => console.log(`Listening on port ${port}..`));
