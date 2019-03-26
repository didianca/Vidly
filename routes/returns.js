const express = require('express');
const router = express.Router();
const {Movie} = require('../models/movie');
const {Rental} = require('../models/rental');
const auth = require('../middleware/auth');
const moment = require('moment');
const Joi = require('joi');
const validate = require('../middleware/validate');

router.post('/', [auth,validate(validateReturn)], async (req, res) => {
    const rental = await Rental.findOne({
        "customer._id": req.body.customerId,
        "movie._id": req.body.movieId
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

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;