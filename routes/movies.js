const {Movie, validate} = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genre');

//GET all
router.get('/', async (req, res) => {
  const movies = await Movie
    .find()
    .sort({title: 1});
  res.send(movies);
});

//POST new
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findOne({_id : req.body.genreId});
  if(!genre) return res.status(400).send('Invalid genre...');
  let movie = new Movie({
    title: req.body.title,
    genre:{
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate:req.body.dailyRentalRate
  });
  movie = await movie.save();
  
  res.send(movie);
});

//UPDATE by id
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findOne({_id : req.body.genreId});
  if(!genre) return res.status(400).send('Invalid genre...');
  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre:{
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate:req.body.dailyRentalRate
  }, {new: true});
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

//DEL by id
router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

//GET by id
router.get('/:id', async (req, res) => {   //check with solution
  const movie = await Movie.findOne({_id : req.params.id});
  if (!movie) return res.status(404).send('The movie with the given ID was not found');
  res.send(movie);
});

module.exports = router;