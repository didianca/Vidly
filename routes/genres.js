const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//TODO: put auth && admin after testing

//get api/genres
router.get('/', async (req, res) => {
    // test error: throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});
//POST /api/genres
router.post('/' , async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({name: req.body.name});
    await genre.save();

    res.send(genre);
});
// PUT/update /api/genres/:id
router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    });
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});
//DELETE /api/genres/:id --> delete existing genre by id
router.delete('/:id',async (req, res) => {   //check with solution
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

module.exports = router;