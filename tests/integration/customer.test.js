const request = require('supertest');
const {Customer} = require('../../models/customer');

describe('/api/customers', () => {
    let server;
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close();
        await Customer.remove({});
    });
    describe('POST /', () => {
        let name;
        let isGold;
        let phone;
        const exec = async () => {
            return await request(server)
                .post('/api/customers')
                .send({name, isGold, phone});
        };
        beforeEach(() => {
            name = '12345';
            phone = '12345';
            isGold = Boolean;
        });

        it('should return 400 if name is less than 5 characters long', async () => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if name is longer than 50 characters long', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if name is missing', async () => {
            name = '';
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if phone is less than 5 characters long', async () => {
            phone = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if phone is longer than 50 characters long', async () => {
            phone = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if phone is not assigned', async () => {
            phone = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if isGold property is not a boolean', async () => {
            isGold = 'a'|| 1 || [] || {}; //assigning all of them is redundant as long as at least one checks the test
            const res = await exec();
            expect(res.status).toBe(400)
        });
        it('should return 400 if isGold property is not assigned', async () => {
            isGold = null;
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });
    describe('PUT /:id', () => {
        let newName;
        let newIsGold;
        let newPhone;
        let id;
        let customer;
        const exec = async () => {
            return await request(server)
                .put('/api/customers' + id)
                .send({name: newName, isGold:newIsGold, phone:newPhone});
        };
        beforeEach(async () => {
             customer = new Customer({
               name: '12345',
                isGold: false,
                phone: '12345'
            });
            await customer.save();

            id = customer._id;
            newName = 'updatedName';
            newPhone = '00000';
            newIsGold = true;
        });

        it('should return 400 if customer name is less than 5 characters long', async () => {
            newName = '1234';
            await exec()
                .catch((e) => {
                    expect(e.status).toBe(400)
                })
        });
        it('should return 400 if customer name is longer than 50 characters long', async () => {
            newName = new Array(52).join('a');
            await exec()
                .catch((e)=>{
                    expect(e.status).toBe(400)
                });
        });
        it('should return 400 if customer name is missing', async () => {
            newName = '';
          await exec()
              .catch((e)=>{
                  expect(e.status).toBe(400)
              });

        });
        it('should return 400 if phone is less than 5 characters long', async () => {
            newPhone = '1234';
            await exec()
                .catch((e)=>{
                    expect(e.status).toBe(400);
                });

        });
        it('should return 400 if phone is longer than 50 characters long', async () => {
            newPhone = new Array(52).join('a');
            await exec()
                .catch((e)=>{
                    expect(e.status).toBe(400)
                });
        });
        it('should return 400 if phone is not assigned', async () => {
            newPhone = '';
            await exec()
                .catch((e)=>{
                    expect(e.status).toBe(400);
                });
        });
        it('should return 400 if isGold property is not a boolean', async () => {
            newIsGold = 'a'|| 1 || [] || {}; //assigning all of them is redundant as long as at least one checks the test
            await exec()
                .catch((e)=>{
                    expect(e.status).toBe(400)
                });
        });
        it('should return 400 if isGold property is not assigned', async () => {
            newIsGold = null;
            await exec()
                .catch((e)=>{
                    expect(e.status).toBe(400);
                });
        });
    })
});