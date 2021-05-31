//const request = require('supertest');
//const { User } = require('../../../models/orderModel');
//
//describe('auth middleware', () => {
//    beforeEach(() => { server = require('../../../index'); })
//    afterEach(async () => {
//        server.close();
//    });
//    
//    let token;
//    
//    const exec = () => {
//        return request(server)
//            .post('/api/v1/coffee')
//            .set('x-auth-token', token)
//            .send({
//                coffee: ['Dark Roast', 'French Roast', 'Columbia'],
//                creamer:['French Vanilla', 'Hazelnut', 'Carmel Mocha'],
//                topping:['Whip Cream', 'Carmel Drizzle', 'Mocha Drizzle'],
//                syrup: ['Caramel', 'Mocha', 'Chocolate'],
//                sweetener: ['No Sugar', 'Stevia', 'Sugar'],
//                price: 4.50
//            });
//    };
//    
//    beforeEach(() => {
//        token = new User().generateAuthToken();
//    })
//    
//    it('should return 401 if no token is provided', async () => {
//        token = '';
//        
//        const res = await exec();
//        
//        expect(res.status).toBe(401);
//    });
//    
//    it('should return 400 if token is invalid', async () => {
//        token = 'a';
//        
//        const res = await exec();
//        
//        expect(res.status).toBe(400);
//    });
//    
//    it('should return 200 if token is valid', async () => {
//        const res = await exec();
//        
//        expect(res.status).toBe(200);
//    });
//});
//
