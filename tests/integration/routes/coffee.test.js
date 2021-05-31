let server;
const request = require('supertest');
const { Coffee } = require('../../../models/coffeeModel');
const { User } = require('../../../models/orderModel');
const mongoose = require('mongoose');


describe('/api/v1/coffee', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        server.close();
        await Coffee.remove({});
    });
    
    describe('GET /', () => {
        it('should return all coffees', async () => {
            await Coffee.collection.insertMany([
                {coffee: ['Dark Roast', 'Cafee Misto', 'Columbia'],
                 creamer: ['No Creamer', 'French Vanilla', 'Hazelnut'],
                 topping: ['Caramel Drizzle', 'Mint Drizzle', 'Whip Cream'],
                 syrup: ['Caramel Syrup', 'Mocha Syrup', 'Chocolate Syrup'],
                 sweetener: ['No Sugar', 'Stevia', 'Sugar'],
                 price: 4.50}
            ]);
            
           const res = await request(server).get('/api/v1/coffee');
           
           expect(res.status).toBe(200);
           expect(res.body.length).toBe(1);
           expect(res.body.some(c => c.coffee[0] === 'Dark Roast')).toBeTruthy();
           expect(res.body.some(c => c.creamer[0] === 'No Creamer')).toBeTruthy();
           
        });
    });
    
     describe('GET /:id', () => {
        
        it('should return coffee based on a valid id', async () => {
            const getCoffees = new Coffee({coffee: ['Dark Roast', 'Cafee Misto', 'Columbia'],
                 creamer: ['No Creamer', 'French Vanilla', 'Hazelnut'],
                 topping: ['Caramel Drizzle', 'Mint Drizzle', 'Whip Cream'],
                 syrup: ['Caramel Syrup', 'Mocha Syrup', 'Chocolate Syrup'],
                 sweetener: ['No Sugar', 'Stevia', 'Sugar'],
                 price: 4.50});
            
            await getCoffees.save();
            
            const res = await request(server).get('/api/v1/coffee/' + getCoffees._id);
                        
            expect(res.status).toBe(200);
            //expect(res.body).toHaveProperty('coffee', getCoffees.coffee);
        });
        
        it('should return 404 if invalid id is passed.', async () => {
            const res = await request(server).get('/api/v1/coffee/1');
                        
            expect(res.status).toBe(404);
        });
        
        it('should return 404 if no coffee with the given id exists.', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/v1/coffee/' + id);
                        
            expect(res.status).toBe(404);
        });
    });

     describe('POST /', () => {
        // Define the happy path, and then in each test, we change one
        //parameter that clearly aligns with the name of the test.
        
        let token;
        let coffee = [];
        let creamer = [];
        let topping = [];
        let syrup = [];
        let sweetener = [];
        let price;
        
        const exec = async () => {
             return await request(server)
                .post('/api/v1/coffee')
                .set('x-auth-token', token)
                .send({ coffee, creamer, topping, syrup, sweetener, price });
        }
        
        beforeEach(() => {
            token = new User().generateAuthToken();
            coffee = ['Dark Roast', 'French Roast', 'Columbia'];
            creamer = ['No Creamer', 'French Vanilla', 'Hazelnut'];
            topping = ['Caramel Drizzle', 'Mint Drizzle', 'Whip Cream'];
            syrup = ['Caramel Syrup', 'Mocha Syrup', 'Chocolate Syrup'];
            sweetener = ['Splenda', 'Stevia', 'Sugar'];
            price = 4.50;
            
        });
        
        it('should return 401 if client is not logged in', async () => {
            token = '';
            
            const res = await exec();
                
            expect(res.status).toBe(401);
        });
        
        it('should return 400 if coffee is less than 3 array elements.', async () => {
            coffee = ['Columbia', 'French Roast'];
            
           const res = await exec();
                
            expect(res.status).toBe(400);
        });
        
        it('should return 400 if coffee is more than 255 array elements', async () => {
            
           coffee = new Array(257).join('a');
            
           const res = await exec();
           
            expect(res.status).toBe(400);
        });
        
        it('should save the coffee if it is valid', async () => {
            await exec();
                
            coffee = await Coffee.find({coffee: 'Dark Roast'});
                
            expect(coffee).not.toBeNull();
        });
        
        it('should return the coffee if it is valid', async () => {
                                    
            const res = await exec();
                            
            expect(res.body).toHaveProperty(['_id']);
            expect(res.body).toHaveProperty(['coffee', 0], 'Dark Roast');
        });    
     });
     
     describe('PUT /:id', () => {
        let token;
        let coffee;
        let newCoffee = [];
        let newCreamer = [];
        let newTopping = [];
        let newSyrup = [];
        let newSweetener = [];
        let newPrice;
        let id;
        
        const exec = async () => {
            return await request(server)
                .put('/api/v1/coffee/' + id)
                .set('x-auth-token', token)
                .send({
                    coffee: newCoffee,
                    creamer: newCreamer,
                    topping: newTopping,
                    syrup: newSyrup,
                    sweetener: newSweetener,
                    price: newPrice
                });
        }
        
        beforeEach(async () => {
            // Before each test we need to create a coffee and 
            // put it in the database.      
            coffee = new Coffee({
                coffee: ['Dark Roast', 'French Roast', 'Columbia'],
                creamer: ['French Vanilla', 'Hazelnut', 'Mocha'],
                topping: ['Whip Cream', 'Caramel Drizzle', 'Chocolate Drizzle'],
                syrup: ['Caramel', 'Mocha', 'Chocolate'],
                sweetener: ['Splenda', 'Stevia', 'Sugar'],
                price: 4.50
            });
      
            await coffee.save();
            
            token = new User().generateAuthToken();     
            id = coffee._id; 
            newCoffee = ['Breakfast Blend', 'Premium Roast', 'Premium Decaf'];
            newCreamer = ['Mint', 'French Vanilla', 'Half & Half'];
            newTopping = ['Mint Drizzle', 'Caramel Drizzle', 'Chocolate Drizzle'];
            newSyrup = ['Mint', 'Caramel', 'Chocolate'];
            NewSweetener = ['No Sugar', 'Stevia', 'Sugar'];
            NewPrice = 5.00;
        });        
        
        it('should return 401 if user not logged in', async () => {
             token = ''; 
     
             const res = await exec();
     
             expect(res.status).toBe(401);
        });
        
        it('should return 400 if coffee is less than 5 characters', async () => {
            newCoffee = ['Dark Roast', 'French Roast'];
            newCreamer = ['Mint', 'French Vanilla'];
            newTopping = ['Mint'];
            newSyrup = ['Caramel'];
            NewSweetener = ['Sugar'];
      
            const res = await exec();
     
            expect(res.status).toBe(400);
        });
        
        it('should return 400 if coffee is more than 255 characters', async () => {
            newCoffee = new Array(256).join('a');
            newCreamer = new Array(256).join('a');
            newTopping = new Array(256).join('a');
            newSyrup = new Array(256).join('a');
            newSweetener = new Array(256).join('a');
     
            const res = await exec();
     
            expect(res.status).toBe(400);
        });
        
        it('should return 404 if id is invalid', async () => {
            id = 1;
            
            const res = await exec();
     
            expect(res.status).toBe(404);
        });
        
        it('should return 404 if coffee with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
     
            const res = await exec();
     
            expect(res.status).toBe(404);
        });
        
         it('should update the coffee if input is valid', async () => {
            await exec();
        
            const updatedCoffee = await Coffee.findById(coffee._id);
        
            expect(updatedCoffee).not.toBe({newCoffee, newCreamer, newTopping, newSyrup, newPrice});
        });
     
        it('should return the updated coffee if it is valid', async () => {
            const res = await exec();
        
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('coffee', {newCoffee, newCreamer, newTopping, newSyrup, newPrice});
        });
    });
    describe('DELETE /:id', () => {
    let token; 
    let coffee; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/v1/coffee/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
       coffee = new Coffee({
                coffee: ['Dark Roast', 'French Roast', 'Columbia'],
                creamer: ['French Vanilla', 'Hazelnut', 'Mocha'],
                topping: ['Whip Cream', 'Caramel Drizzle', 'Chocolate Drizzle'],
                syrup: ['Caramel', 'Mocha', 'Chocolate'],
                sweetener: ['Splenda', 'Stevia', 'Sugar'],
                price: 4.50
       });
       
      await coffee.save();
      
      id = coffee._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no coffee with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the coffee if input is valid', async () => {
      await exec();

      const coffeeInDb = await Coffee.findById(id);

      expect(coffeeInDb).toBeNull();
    });

    it('should return the removed coffee', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', coffee._id.toHexString());
      expect(res.body).toHaveProperty('coffee', coffee.coffee);
    });
  });  
});