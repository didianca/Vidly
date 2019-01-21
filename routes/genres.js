const express = require('express');
const router = express.Router();



const genres = [
  {id: 1, name: 'action'},
  {id: 2, name: 'comedy'},
  {id: 3, name: 'drama'},
  {id: 4, name: 'romance'}
];

//get api/genres --> (get all the genres in a list)
router.get('/',(req,res)=>{
  res.send(genres);
});

//POST /api/genres --> post a new genre and add /it to the list of genres
router.post('/',(req,res)=>{
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push((genre));
  res.send(genre);
});

// PUT/update /api/genres/:id --> update existing genre by id
router.put('/:id',(req,res)=>{
  const genre = genres.find( c =>c.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('The genre with the given ID was not found.');
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  
  genre.name = req.body.name;
  res.send(genre)
});

router.delete('/:id',(req,res)=>{
  const genre = genres.find( c =>c.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  //Delete
  const index = genres.indexOf(genre);
  genres.splice(index,1);
  
  //Return the genre that was deleted
  res.send(genre);
});


// get api/genre/:id --> (get a specific genre by id)
router.get('/:id',(req,res) => {
  const genre = genres.find( c =>c.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

function validateGenre(genre){
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(genre,schema);
}

module.exports = router;