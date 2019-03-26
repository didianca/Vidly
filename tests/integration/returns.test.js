const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    };

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();


       movie = new Movie({
          _id: movieId,
          title: '12345',
          dailyRentalRate: 2,
          genre: {name: '12345'},
          numberInStock: 10
       });
       await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async () => {
        server.close();

        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        await exec()
            .catch((e) => {
                expect(e.status).toBe(401)
            })
    });
    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        await exec()
            .catch((e) => {
                expect(e.status).toBe(400)
            })

    });
    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        await exec()
            .catch((e) => {
                expect(e.status).toBe(400)
            })

    });
    it('should return 404 if no rental was found for this movieId and customerID', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404)
    });
    it('should return 400 if  rental was already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();
        expect(res.status).toBe(400)
    });
    it('should return 200 if the request is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200)
    });
    it('should set the return date if input is valid', async () => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned; //the diff between when we call the date and when the test is processed
        expect(diff).toBeLessThan(10 * 1000);
    });
    it('should calculate the rental fee if input  is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();
        const rentalInDb = await Rental.findById(rental._id);

        //const numberOfDays = rentalInDb.dateReturned - rentalInDb.dateOut;
        //const rentalFee = (numberOfDays * (rentalInDb.movie.dailyRentalRate));
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it('should increase the movie stock if input is valid', async () => {
        await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
})
;
