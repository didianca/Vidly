const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//TODO: put auth && admin after testing

//get api/genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});
//POST /api/genres
router.post('/', [auth,validate(validateGenre)],async (req, res) => {
    const genre = new Genre({name: req.body.name});
    await genre.save();

    res.send(genre);
});
// PUT/update /api/genres/:id
router.put('/:id',validate(validateGenre), async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    });
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});
//DELETE /api/genres/:id --> delete existing genre by id
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    //Return the genre that was deleted
    res.send(genre);
});
// get api/genre/:id --> (get a specific genre by id)
router.get('/:id', validateObjectId,async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

module.exports = router;