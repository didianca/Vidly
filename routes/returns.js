const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId was not provided');
    if (!req.body.movieId) return res.status(400).send('movieId was not provided');
    res.status(401).send('Unauthorized');
});

module.exports = router;