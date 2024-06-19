const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Router = (fastify, options, done) => {
  
  fastify.post('/register', async (req, res) => {
    const { name, email, password, telephone } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        telephone
      });
      res.code(201).send({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.code(500).send({ error: 'User registration failed', details: error });
    }
  });

 
  fastify.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.code(404).send({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.code(401).send({ error: 'Invalid password' });
      }

      const token = jwt.sign({ id: user.id }, 'lkhhjcxtsrtfb215', { expiresIn: '1h' });
      res.code(200).send({ message: 'Login successful', token });
    } catch (error) {
      res.code(500).send({ error: 'Login failed', details: error });
    }
  });

  done();
};

module.exports = Router;

// GET all users
  // fastify.get('/getUser', (req, res) => {
  //   console.log('GET all users');
  //   res.code(200).send(dataUsers);
  // });

  // // GET user by ID
  // fastify.get('/getUser/:id', (req, res) => {
  //   const userId = parseInt(req.params.id);
  //   console.log(`GET user by ID: ${userId}`);
  //   const user = dataUsers.find(u => u.id === userId);
  //   if (user) {
  //     res.code(200).send(user);
  //   } else {
  //     res.code(404).send({ error: 'User not found' });
  //   }
  // });

  // // POST add new user
  // fastify.post('/addUser', (req, res) => {
  //   const { id, name, email, telephone } = req.body;
  //   console.log('POST add new user:', req.body);
  //   const newUser = {
  //     id: id ? parseInt(id) : dataUsers.length + 1,
  //     name,
  //     email,
  //     telephone
  //   };
  //   dataUsers.push(newUser);
  //   res.code(201).send(newUser);
  // });

  // // PUT update user by ID
  // fastify.put('/updateUser/:id', (req, res) => {
  //   const userId = parseInt(req.params.id);
  //   console.log(`PUT update user by ID: ${userId}, Body:`, req.body);
  //   const index = dataUsers.findIndex(u => u.id === userId);
  //   if (index !== -1) {
  //     dataUsers[index] = {
  //       id: userId,
  //       name: req.body.name,
  //       email: req.body.email,
  //       telephone: req.body.telephone
  //     };
  //     res.code(200).send(dataUsers[index]);
  //   } else {
  //     res.code(404).send({ error: 'User not found' });
  //   }
  // });

  // // DELETE user by ID
  // fastify.delete('/deleteUser/:id', (req, res) => {
  //   const userId = parseInt(req.params.id);
  //   console.log(`DELETE user by ID: ${userId}`);
  //   const index = dataUsers.findIndex(u => u.id === userId);
  //   if (index !== -1) {
  //     const deletedUser = dataUsers.splice(index, 1);
  //     res.code(200).send(deletedUser[0]);
  //   } else {
  //     res.code(404).send({ error: 'User not found' });
  //   }
  // });

