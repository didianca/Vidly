const request = require('supertest');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');

describe('/api/movies', () => {
    let server;
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close();
        await Movie.remove({});
    });
    describe('POST /', () => {
        let title;
        let genreId;
        let numberInStock;
        let dailyRentalRate;
        const exec = async () => {
            return await request(server)
                .post('/api/movies')
                .send({title, genreId, numberInStock, dailyRentalRate});
        };
        beforeEach(() => {
            title = '12345';
            genreId = mongoose.Types.ObjectId();
            numberInStock = 10;
            dailyRentalRate = 2;
        });
        it('should return 400 if title is not a string', async () => {
            title = 12345;
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if title is less than 5 characters long', async () => {
            title = '1234';
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if title is longer than 255 characters long', async () => {
            title = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if title is missing', async () => {
            title = '';
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if genreId invalid', async () => {
            genreId = 1 || 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if genreId is not provided', async () => {
            genreId = '';
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if numberInStock property is invalid', async () => {
            numberInStock = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if numberInStock property is missing', async () => {
            numberInStock = '';
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if dailyRentalRate property is invalid', async () => {
            numberInStock = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if dailyRentalRate property is missing', async () => {
            numberInStock = '';
            const res = await exec();
            expect(res.status).toBe(400)
        });
    });
    describe('PUT /:id', () => {
        let newTitle;
        let newGenreId;
        let newNumberInStock;
        let newDailyRentalRate;
        let movie;
        let id;
        const exec = async () => {
            return await request(server)
                .put('/api/movies' + id)
                .send({
                    title: newTitle,
                    genreId: newGenreId,
                    numberInStock: newNumberInStock,
                    dailyRentalRate: newDailyRentalRate
                });
        };
        beforeEach(async () => {
           let  genreId = mongoose.Types.ObjectId();
            movie = new Movie({
                title: '12345',
                genre: {_id: genreId, name: '12345'},
                numberInStock: 10,
                dailyRentalRate: 2
            });
            await movie.save();

            newTitle = 'updatedTitle';
            newGenreId = mongoose.Types.ObjectId();
            newNumberInStock = 11;
            newDailyRentalRate = 3;
        });

        it('should return 400 if title is not a string', async () => {
            title = 12345;
            await exec().catch((e) => {
                expect(e.status).toBe(400)
            });
        });
        it('should return 400 if title is less than 5 characters long', async () => {
            title = '1234';
            await exec().catch((e) => {
                expect(e.status).toBe(400)
            });
        });
        it('should return 400 if title is longer than 255 characters long', async () => {
            title = new Array(257).join('a');
            await exec().catch((e) => {
                expect(e.status).toBe(400)
            });
        });
        it('should return 400 if title is missing', async () => {
            title = '';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });
        });
        it('should return 400 if genreId invalid', async () => {
            genreId = 1 || 'a';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });
        });
        it('should return 400 if genreId is not provided', async () => {
            genreId = '';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });
        });
        it('should return 400 if numberInStock property is invalid', async () => {
            numberInStock = 'a';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });
        });
        it('should return 400 if numberInStock property is missing', async () => {
            numberInStock = '';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });
        });
        it('should return 400 if dailyRentalRate property is invalid', async () => {
            numberInStock = 'a';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });

        });
        it('should return 400 if dailyRentalRate property is missing', async () => {
            numberInStock = '';
            await exec().catch((e) => {
                expect(e.status).toBe(400);
            });

        });
    })
});