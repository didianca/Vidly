const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');


router.post('/', auth, async (req, res) => {

    if (!req.body.customerId) return res.status(400).send('customerId was not provided');
    if (!req.body.movieId) return res.status(400).send('movieId was not provided');

    const customer = await Customer.findOne({_id: req.body.customerId});
    const movie = await Movie.findOne({_id: req.body.movieId});
    let rental;
    rental = await Rental.findOne({
        "customerId._id":customer,
        "movieId._id": movie
    });
    if (!rental) return res.status(404).send("The rental was not found");
    if (rental.dateReturned) return res.status(400).send('The return was already processed');

    rental.dateReturned = Date.now();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = (rentalDays * rental.movie.dailyRentalRate);
    //const numberOfDays = rental.dateReturned - rental.dateOut;
    //rental.rentalFee =(numberOfDays * (rental.movie.dailyRentalRate));
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
        $inc: {numberInStock: +1}
    });

    res.status(200).send(rental)
});

module.exports = router;