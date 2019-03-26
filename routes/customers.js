const {Customer, validateCustomer} = require('../models/customer');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');

//GET all
router.get('/', async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});
//POST new
router.post('/', validate(validateCustomer),async (req, res) => {
  
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
   await customer.save();
  
  res.send(customer);
});
//PUT updateBYid
router.put('/:id', validate(validateCustomer),async (req, res) => {
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
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found');
  res.send(customer);
});

async function getCustomers() {
  return await Customer
    .find()
    .sort({name: 1});
}
module.exports = router;
