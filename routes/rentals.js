const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//TODO: put auth && admin after testing

Fawn.init(mongoose);

//GET /api/rentals
router.get('/', async (req, res) => {
  const rentals = await getRentals();
  res.send(rentals);
});
//POST /api/rentals
router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const customer = await Customer.findOne({_id:req.body.customerId});
  if (!customer) return res.status(400).send('Invalid customer...');
  
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');
  
  if (movie.numberInStock === 0) return res.status(400).send('Movie isn\'t in stock.');
  
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  // !!!Two phase commit!!! -- mongoDB solution for Transactions!!!
  // rental = await rental.save();
  // movie.numberInStock--;
  // movie.save();
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {
        $inc: {numberInStock: -1}
      })
      .run();
    res.send(rental);
  } catch (e) {
    res.status(500).send('Something went wrong...');
  }
});

//GET api/rentals/:id
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('The rental object with the given ID was not found');
  res.send(rental);
});


async function getRentals() {
  return await Rental
    .find()
    .sort({dateOut: -1});
}

module.exports = router;