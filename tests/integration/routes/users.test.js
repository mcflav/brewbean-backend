const request = require('supertest');
const { User } = require('../../../models/orderModel');
const mongoose = require('mongoose');

let server;

describe('/api/users', () => {
    beforeEach(() => { server = require('../../../index');});
    afterEach( async () => {
        server.close();
        await User.remove({});    
    });
    
    
    describe('GET /', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([
                {email: 'test1@gmail.com', firstname: 'test1first', lastname: 'test1last', password: '1password', isAdmin: 'false'},
                {email: 'test2@gmail.com', firstname: 'test2first', lastname: 'test2last', password: '2password', isAdmin: 'false'},
                {email: 'test3@gmail.com', firstname: 'test3first', lastname: 'test3last', password: '3password', isAdmin: 'false'} 
            ]);    
        
            const res = await request(server).get('/api/v1/users/');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(u => u.email === 'test1@gmail.com')).toBeTruthy();
            expect(res.body.some(u => u.email === 'test2@gmail.com')).toBeTruthy();
            expect(res.body.some(u => u.email === 'test3@gmail.com')).toBeTruthy();
        });
    });
    
    describe('GET /:id', () => {
        it('should return user if valid id supplied', async () => {
            const getUser = new User({email: 'test4@gmail.com', firstname: 'test4first', lastname: 'test4last', password: '4password', isAdmin: 'false'});
            await getUser.save();
            
            const res = await request(server).get('/api/v1/users/' + getUser._id);
                                                  
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', getUser.email);
        })
        
        it('should return 404 if invalid id supplied', async () => {
                       
            const res = await request(server).get('/api/v1/users/1');
                                                  
            expect(res.status).toBe(404);
        })
    })

    describe('POST /', () => {
        let token;
        let email;
        let firstname;
        let lastname;
        let password;
        let isAdmin;
        
        const exec = async () => {
            return await request(server)
                .post('/api/v1/users')
                .send({email: email, firstname: firstname, lastname: lastname, password: password, isAdmin: isAdmin});
        }
        
        beforeEach(() => {
            email = 'test1@gmail.com';
            firstname = 'test1first';
            lastname = 'test1last';
            password = '1password';
            isAdmin = 'false';
        })
        
        it('should return 400 if user email is less than 5 characters', async () => {
            email = 'test';             
            const res = await exec();
                
            expect(res.status).toBe(400);
        });
        
        it('should return 400 if user email is less more than 255 characters', async () => {
            email = new Array(256).join('a');
            
            const res = await exec();
                
            expect(res.status).toBe(400);
        });
        
        it('should save the user if it is valid', async () => {
            await exec();
            
            const email = await User.find({email: 'test1@gmail.com'});
                
            expect(email).not.toBeNull();
        });
        
        it('should return the email if it is valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('email', 'test1@gmail.com');
        });
    });
      describe('PUT /:id', () => {
        let id;
        let email;
        let firstname;
        let lastname;
        let password;
        let isAdmin;
        let user;
           
        const exec = async () => {
            return await request(server)
                .put('/api/v1/users' + id)
                .send({email: email, firstname: firstname, lastname: lastname, password: password, isAdmin: isAdmin});
        }
        
        beforeEach(async () => {
             user = new User({
                email: 'test4@gmail.com',
                firstname: 'test4first',
                lastname: 'test4last',
                password: '4password',
                isAdmin: false
             });
             
             await user.save();
             
             id = user._id;
            
            email = 'test5@gmail.com';
            firstname = 'test5first';
            lastname = 'test5last';
            password = '5password';
            isAdmin = true;
        });
      
        it('should return 400 if user input is less than 3 (firstname and lastname)  or 5(email and password).', async () => {
            email = 'nc2@';
            firstname = 'Fr';
            lastname = 'Ta';
            password = 'pass';
                    
            const res = await exec();
                
            expect(res.status).toBe(400);
        });
     
        it('should return 400 if user input is more than 255 characters', async () => {
            email = new Array(256).join('a');
            firstname = new Array(256).join('a');
            lastname = new Array(256).join('a');
            password = new Array(256).join('a');
                 
            const res = await exec();
     
            expect(res.status).toBe(400);
        });
      
        it('should return 404 if id is invalid', async () => {
            id = 1;
            
            const res = await exec();
     
            expect(res.status).toBe(404);
        });
     //   
        it('should return 404 if user with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
     
            const res = await exec();
     
            expect(res.status).toBe(404);
        });
     //   
         it('should update the user if input is valid', async () => {
            await exec();
        
            const updatedUser = await User.findById(id);
        
            expect(updatedUser.email).not.toBe(email);
        });
     //
        it('should return the updated user if it is valid', async () => {
            const res = await exec();
        
            //expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('email', email);
        });
    });
     
    describe('DELETE /:id', () => {
        let id;
        let email;
        let firstname;
        let lastname;
        let password;
        let isAdmin;
        let user;
//
        const exec = async () => {
        return await request(server)
            .delete('/api/v1/orders/' + id)
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
                isAdmin: true
            });
       
            await user.save();
        
            id = user._id;
        })

        it('should return 404 if id is invalid', async () => {
            id = 1; 
      
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if no user with the given id was found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the user if input is valid', async () => {
            await exec();

            const userInDb = await User.findById(id);

            expect(userInDb).toBeNull();
        });

        it('should return the removed user', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', user._id.toHexString());
            expect(res.body).toHaveProperty('user', user.email);
        });
    });      
});
