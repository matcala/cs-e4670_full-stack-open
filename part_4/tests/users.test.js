const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('starting state of one user', () => {

   beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('pwdpwdpwd', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
   })

   test('creation succeeds with a new username', async () => {
      const usersAtStart = await helper.allUsers()

      const newUser = {
         username: 'mluukkai',
         name: 'Matti Luukkainen',
         password: 'salainen',
      }

      await api
         .post('/api/users')
         .send(newUser)
         .expect(200)
         .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.allUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
   })

   test('creation fails if username is already taken', async () => {
      const usersAtStart = await helper.allUsers()

      const newUser = {
         username: 'root',
         name: 'Superuser',
         password: 'pwdpwdpwd',
      }

      const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.allUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
   })

   test('creation fails if username has length less than 3', async () => {
      const usersAtStart = await helper.allUsers()

      const newUser = {
         username: 'r',
         name: 'Superuser',
         password: 'salainen',
      }

      const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.allUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
   })

   test('creation fails if password has length less than 3', async () => {
      const usersAtStart = await helper.allUsers()

      const newUser = {
         username: 'test',
         name: 'Superuser',
         password: 'pw',
      }

      const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)


      const usersAtEnd = await helper.allUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
   })

   test('creation fails if username is not provided', async () => {
      const usersAtStart = await helper.allUsers()

      const newUser = {
         name: 'Superuser',
         password: 'salainen',
      }

      const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)


      const usersAtEnd = await helper.allUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
   })

   test('creation fails if password is not provided', async () => {
      const usersAtStart = await helper.allUsers()

      const newUser = {
         username: 'test',
         name: 'Superuser'
      }

      const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.allUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
   })
})

afterAll(() => {
   mongoose.connection.close()
})

