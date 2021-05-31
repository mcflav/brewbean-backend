let server;
const request = require('supertest');
const { User, Order } = require('../../../models/orderModel');
const mongoose = require('mongoose');

describe('/api/v1/orders', () => {
     beforeEach(() => { server = require('../../../index'); });
     afterEach(async () => {
        server.close();
        await Order.remove({});
        await User.remove({});
     });
     
     describe('GET /', () => {
        let coffee = 'Dark Roast';
        let creamer = "French Vanilla";
        let topping = "Caramel";
        let syrup = "Caramel";
        let sweetener = "Stevia";
        let price = 4.50;
        let quantity = 2;
        let subTotal = price * quantity;
        let user;
        let id;
        
        it('should return all orders', async () => {
            user = new User({
            email: 'test1@gmail.com',
            firstname: 'test1first',
            lastname: 'test1last',
            password: '1password',
            isAdmin: 'false'
            });
       
            await user.save();
        
            id = user._id;
            
            const order = new Order ({
                coffee,
                creamer,
                topping,
                syrup,
                sweetener,
                price,
                quantity,
                subTotal,
                id
            });
            
            await order.save();
            
            const res = await request(server).get('/api/v1/orders');
           
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body.some(o => o.coffee === 'Dark Roast')).toBeTruthy();
            expect(res.body.some(o => o.creamer === 'French Vanilla')).toBeTruthy();
        });
    });
     
    describe('GET /:id', () => {
        let coffee = 'Dark Roast';
        let creamer = "French Vanilla";
        let topping = "Caramel";
        let syrup = "Caramel";
        let sweetener = "Stevia";
        let price = 4.50;
        let quantity = 2;
        let subTotal = price * quantity;
        let user;
        let id;
        
        const exec = async () => {
            user = new User({
                email: 'test1@gmail.com',
                firstname: 'test1first',
                lastname: 'test1last',
                password: '1password',
                isAdmin: 'false'
            });
       
            await user.save();
        
            id = user._id;
            
            const order = new Order ({
                coffee,
                creamer,
                topping,
                syrup,
                sweetener,
                price,
                quantity,
                subTotal,
                id
            });
            
           return await order.save();
        }
        
        it('should return order based on a valid id', async () => {
            const order = await exec();
                     
            const res = await request(server).get('/api/v1/orders/' + order._id);
                        
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('coffee', order.coffee);
        });
        
        it('should return order based on user id', async () => {
            await exec();
           
            const res = await request(server)
                .get('/api/v1/orders/getOrder')
                .send({
                    user: id
            });
            
            expect(res.status).toBe(200);
            //expect(res.body).toHaveProperty('coffee', order.coffee);
        });
        
        it('should return 404 if invalid id is passed.', async () => {
            const res = await request(server).get('/api/v1/orders/1');
                        
            expect(res.status).toBe(404);
        });
        
        it('should return 404 if no coffee with the given id exists.', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/v1/orders/' + id);
                        
            expect(res.status).toBe(404);
        });
    });
    
     describe('POST /', () => {
//        // Define the happy path, and then in each test, we change one
//        //parameter that clearly aligns with the name of the test.
//        
        let coffee;
        let creamer;
        let topping;
        let syrup;
        let sweetener;
        let price;
        let quantity;
        let subTotal;
        let user;
        let id;
        let token;
        let order;
        
        const exec = async () => {
                user = new User({
                email: 'test1@gmail.com',
                firstname: 'test1first',
                lastname: 'test1last',
                password: '1password',
                isAdmin: 'false'
            });
       
            await user.save();
        
            id = user._id;
            
            return await request(server)
                .post('/api/v1/orders')
                .set('x-auth-token', token)
                .send({ coffee, creamer, topping, syrup, sweetener, price, quantity, subTotal, id });
        }
        
        beforeEach(() => {
            token = new User().generateAuthToken();
            coffee = 'Dark Roast';
            creamer = 'French Vanilla';
            topping = 'Caramel Drizzle';
            syrup = 'Caramel Syrup';
            sweetener = 'Splenda';
            price = 4.50;
            quantity = 2;
            subTotal = price * quantity;            
        });
        
        it('should return 401 if client is not logged in', async () => {
            token = '';
            
            const res = await exec();
                
            expect(res.status).toBe(401);
        });
//        
        it('should return 400 if order items is less than 5', async () => {
            coffee = 'Cofe';
            creamer = 'Fren';
            topping = 'Caram';
            syrup = 'Caram';
            sweetener = 'Sple';
            
           const res = await exec();
                
            expect(res.status).toBe(400);
        });
//        
        it('should return 400 if order items are more than 255', async () => {
            
           coffee = new Array(256).join('a');
           creamer = new Array(256).join('a');
           topping = new Array(256).join('a');
           syrup = new Array(256).join('a');
           sweetener = new Array(256).join('a');
            
           const res = await exec();
           
            expect(res.status).toBe(400);
        });
//        
        it('should save the order if it is valid', async () => {
            await exec();
                
            coffee = await Order.find({coffee: 'Dark Roast'});
                
            expect(coffee).not.toBeNull();
        });
//        
        it('should return the order if it is valid', async () => {
                                    
            const res = await exec();
             const order = new Order ({
                coffee,
                creamer,
                topping,
                syrup,
                sweetener,
                price,
                quantity,
                subTotal,
                id
            });
            
           return await order.save();
                            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('coffee', 'Dark Roast');
        });    
    });
     
     describe('PUT /:id', () => {
        let token;
        let order;
        let newCoffee;
        let newCreamer;
        let newTopping;
        let newSyrup;
        let newSweetener;
        let newPrice;
        let newQuantity;
        let id;
        let orderId;
        let coffee = "Columbia";
        let creamer = "Half & Half";
        let topping = "No topping";
        let syrup = "No syrup";
        let sweetener = "Truvia";
        let price = 4.50;
        let quantity = 1;
          
     //   
        const exec = async () => {
            return await request(server)
                .put('/api/v1/orders/' + orderId)
                .set('x-auth-token', token)
                .send({
                    coffee: newCoffee,
                    creamer: newCreamer,
                    topping: newTopping,
                    syrup: newSyrup,
                    sweetener: newSweetener,
                    price: newPrice,
                    quantity: newQuantity,
                    user: id
                });
        }
     //   
        beforeEach(async () => {
            token = new User().generateAuthToken();
            
            // Before each test we need to create a user and order and 
            // put it in the database.
             user = new User({
                email: 'test1@gmail.com',
                firstname: 'test1first',
                lastname: 'test1last',
                password: '1password',
                isAdmin: 'false'
            });
       
            await user.save();
        
            id = user._id;
            
            order = new Order ({
                coffee,
                creamer,
                topping,
                syrup,
                sweetener,
                price,
                quantity,
                id
            });
            
            await order.save();
            
            orderId = order._id;
            
            newCoffee = "Premium Roast";
            newCreamer = "French Vanilla";
            newTopping = "No topping";
            newSyrup = "No syrup";
            newSweetener = "Truvia";
            newPrice = 4.50;
            newQuantity = 1;
        });        
      
        it('should return 401 if user not logged in', async () => {
             token = ''; 
        
             const res = await exec();
        
             expect(res.status).toBe(401);
        });
        
       it('should return 400 if order items is less than 5.', async () => {
            newCoffee = 'Cofe';
            newCreamer = 'Fren';
            newTopping = 'Caram';
            newSyrup = 'Caram';
            newSweetener = 'Sple';
            newPrice = 4.50;
            newQuantity = 1;
                               
            const res = await exec();
                
            expect(res.status).toBe(400);
        });
     //   
        it('should return 400 if coffee is more than 255 characters', async () => {
            newCoffee = new Array(256).join('a');
            newCreamer = new Array(256).join('a');
            newTopping = new Array(256).join('a');
            newSyrup = new Array(256).join('a');
            newSweetener = new Array(256).join('a');
     
            const res = await exec();
     
            expect(res.status).toBe(400);
        });
     //   
        it('should return 404 if id is invalid', async () => {
            orderId = 1;
            
            const res = await exec();
     
            expect(res.status).toBe(404);
        });
     //   
        it('should return 404 if order with the given id was not found', async () => {
            orderId = mongoose.Types.ObjectId();
     
            const res = await exec();
     
            expect(res.status).toBe(404);
        });
     //   
         it('should update the order if input is valid', async () => {
            await exec();
        
            const updatedOrder = await Order.findById(order._id);
        
            expect(updatedOrder.coffee).not.toBe(newCoffee);
        });
     //
        it('should return the updated order if it is valid', async () => {
            const res = await exec();
        
            //expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('coffee', newCoffee);
        });
    });
     
    describe('DELETE /:id', () => {
        let token; 
        let order; 
        let orderId;
        let coffee = "Columbia";
        let creamer = "Half & Half";
        let topping = "No topping";
        let syrup = "No syrup";
        let sweetener = "Truvia";
        let price = 4.50;
        let quantity = 1;
//
        const exec = async () => {
        return await request(server)
            .delete('/api/v1/orders/' + orderId)
            .set('x-auth-token', token)
            .send();
        }
//
        beforeEach(async () => {
            // Before each test we need to create a genre and 
            // put it in the database.      
             user = new User({
                email: 'test1@gmail.com',
                firstname: 'test1first',
                lastname: 'test1last',
                password: '1password',
                isAdmin: 'true'
            });
       
            await user.save();
        
            id = user._id;
            
            order = new Order ({
                coffee,
                creamer,
                topping,
                syrup,
                sweetener,
                price,
                quantity,
                id
            });
            
            await order.save();
            
            orderId = order._id; 
            token = new User({ isAdmin: true }).generateAuthToken();     
        })
//
        it('should return 401 if client is not logged in', async () => {
            token = ''; 

            const res = await exec();

            expect(res.status).toBe(401);
        });
//
        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken(); 

            const res = await exec();

            expect(res.status).toBe(403);
        });
//
        it('should return 404 if id is invalid', async () => {
            orderId = 1; 
      
            const res = await exec();

            expect(res.status).toBe(404);
        });
//
        it('should return 404 if no order with the given id was found', async () => {
            orderId = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the order if input is valid', async () => {
            await exec();

            const orderInDb = await Order.findById(orderId);

            expect(orderInDb).toBeNull();
        });

        it('should return the removed order', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', order._id.toHexString());
            expect(res.body).toHaveProperty('coffee', order.coffee);
        });
    });      
});