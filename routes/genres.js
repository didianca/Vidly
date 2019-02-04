const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

//Connect to MongoDB
mongoose.connect('mongodb://localhost/vidly-genres', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => new Error('Could not connect to MongoDB...'));
//Build basic Schema && Genre Class

const genreSchema = new mongoose.Schema({
  id: {},
  name: {
    type: String,
    required: true
  },
  date: {type: Date, default: Date.now}
});
const Genre = mongoose.model('Genre', genreSchema);


//get api/genres --> (get all the genres in a list)
router.get('/', async (req, res) => {   //check
  const genres = await getGenres();
  res.send(genres);
});

//POST /api/genres --> post a new genre and add /it to the list of genres
router.post('/', (req, res) => {     //check
  const {error} = validateGenre(req.body);
  const genre = req.body;
  const result = createGenre(genre.name);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {//else: create new genre
    if (result) {
      res.send(genre);
    } else {
      res.status(400).send(error.details[0].message + 'The function did not work!!!')
    }
  }
  
});

// PUT/update /api/genres/:id --> update existing genre by id
router.put('/:id', async (req, res) => {      //TODO: broken. check solution for advise.
  //const genre = await getGenreById(req.params.id); //id is given in the url not the req.body!!
  const genre = await Genre.updateOne({ _id: req.params.id}, {
    $set: {
      name: req.body.name
    }
  });
  if (!req.params.id) return res.status(404).send('The genre with the given ID was not found.');
  
  const {error} = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  genre.name = req.body.name;
  res.send(genre)
});

router.delete('/:id', async (req, res) => {   //check
  const genres = await getGenres();
  const genre = await Genre.findByIdAndDelete(req.params.id);
  //const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  //Delete
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  //
  //Return the genre that was deleted
  res.send(genre);
});


// get api/genre/:id --> (get a specific genre by id)
router.get('/:id', async (req, res) => {   //check
  const genre = await Genre.findById(req.params.id);
  //const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(genre, schema);
}

async function getGenres() {
  return await Genre
    .find();
}

async function createGenre(name) {
  const genre = new Genre({
    name: name
  });
  try {
    return await genre.save();
    
  } catch (e) {
    for (field in e.errors) {
      console.log(e.errors[field].message);
    }
    return false;
  }
}


module.exports = router;