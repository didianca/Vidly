const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  date: {type: Date, default: Date.now}
});
const Customer = mongoose.model('Customer', customerSchema);

//GET all
router.get('/', async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});

//POST new
router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();
  
  res.send(customer);
});

//PUT updateBYid
router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  }, {new: true});
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
});

//DELETE by id
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
});

//GET by id
router.get('/:id', async (req, res) => {   //check with solution
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found');
  res.send(customer);
});
function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()
  };
  
  return Joi.validate(customer, schema);
}

async function getCustomers() {
  return await Customer
    .find()
    .sort({name: 1});
}

module.exports = router;
