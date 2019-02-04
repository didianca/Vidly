const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

//Build basic Schema && Genre Class
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength:50
  },
  date: {type: Date, default: Date.now}   //easy to find in db if the name repeats
});
const Genre = mongoose.model('Genre', genreSchema);

//get api/genres --> (get all the genres in a list)
router.get('/', async (req, res) => {   //checked with solution
  const genres = await getGenres();
  // SOLUTION: const genres = await Genre.find().sort('name');
  res.send(genres);
});

//POST /api/genres --> post a new genre and add /it to the list of genres
router.post('/', async (req, res) => {     //check and changed with solution
  const {error} = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let genre = new Genre({name:req.body.name});
  genre = await genre.save();
  
  res.send (genre);
});

// PUT/update /api/genres/:id --> update existing genre by id
router.put('/:id', async (req, res) => {      //check and fixed with solution
  const {error} = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findByIdAndUpdate(req.params.id,{
    name:req.body.name
  },{
    new:true
  });
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

//DELETE /api/genres/:id --> delete existing genre by id
router.delete('/:id', async (req, res) => {   //check with solution
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  //Return the genre that was deleted
  res.send(genre);
});


// get api/genre/:id --> (get a specific genre by id)
router.get('/:id', async (req, res) => {   //check with solution
  const genre = await Genre.findById(req.params.id);
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
    .find()
    .sort({name:1});
}


module.exports = router;