const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)

// clear db and initialise with list from helper
beforeEach(async () => {
   await Blog.deleteMany({})

   for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
   }
})

describe('Retrieving blogs', () => {

   test('blogs are returned properly', async () => {
      const response = await api
         .get('/api/blogs')
         .expect(200)
         .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(helper.initialBlogs.length)
   }, 10000)

   test('all blogs havea an id', async () => {
      const response = await api
         .get('/api/blogs')
         .expect(200)
         .expect('Content-Type', /application\/json/)

      for (let blog of response.body) {
         expect(blog.id).toBeDefined()
      }
   }, 10000)
})

describe('Posting new blogs', () => {

   test('blog can be posted', async () => {

      const newBlog = {
         title: 'test blog',
         author: 'mr test',
         url: 'test.com',
         likes: 6,
      }

      await api
         .post('/api/users')
         .send({ name: 'mr test', username: 'testy', password: 'pwdpwdpwd' })

      const loggedUser = await api
         .post('/api/login')
         .send({ username: 'testy', password: 'pwdpwdpwd' })
         .expect(200)
         .expect('Content-type', /application\/json/)

      const response = await api
         .post('/api/blogs')
         .send(newBlog)
         .set('Authorization', `bearer ${loggedUser.body.token}`)
         .expect(201)
         .expect('Content-Type', /application\/json/)

      const newBlogs = await helper.allBlogs()

      const contents = newBlogs.map(b => b.title)

      // blog is indeed added and corresponds to the sent one
      expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1)
      expect(contents).toContain('test blog')
   })

   test('blog with no likes defined defaults to zero likes', async () => {
      const newBlog = {
         title: 'test with no likes',
         author: 'testy',
         url: 'test.com',
      }
      await api
         .post('/api/users')
         .send({ name: 'mr test', username: 'testy', password: 'pwdpwdpwd' })

      const user = await api
         .post('/api/login')
         .send({ username: 'testy', password: 'pwdpwdpwd' })
         .expect(200)
         .expect('Content-type', /application\/json/)

      const response = await api
         .post('/api/blogs')
         .set('Authorization', `bearer ${user.body.token}`)
         .send(newBlog)
         .expect(201)
         .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(0)
   })

   test('blog with no url and title not created', async () => {
      const newBlog = {
         author: 'testy',
         likes: 6,
      }
      await api
         .post('/api/users')
         .send({ name: 'mr test', username: 'testy', password: 'pwdpwdpwd' })

      const user = await api
         .post('/api/login')
         .send({ username: 'testy', password: 'pwdpwdpwd' })
         .expect(200)
         .expect('Content-type', /application\/json/)

      await api
         .post('/api/blogs')
         .set('Authorization', `bearer ${user.body.token}`)
         .send(newBlog)
         .expect(400)
         .expect('Content-Type', /application\/json/)
   })

   test('blog with no title not created', async () => {
      const newBlog = {
         author: 'testy',
         url: 'test.com',
         likes: 6,
      }
      await api
         .post('/api/users')
         .send({ name: 'mr test', username: 'testy', password: 'pwdpwdpwd' })

      const user = await api
         .post('/api/login')
         .send({ username: 'testy', password: 'pwdpwdpwd' })
         .expect(200)
         .expect('Content-type', /application\/json/)

      await api
         .post('/api/blogs')
         .set('Authorization', `bearer ${user.body.token}`)
         .send(newBlog)
         .expect(400)
         .expect('Content-Type', /application\/json/)
   })

   test('blog wuth no url not created', async () => {
      const newBlog = {
         title: 'test no url',
         author: 'test',
         likes: 6,
      }
      await api
         .post('/api/users')
         .send({ name: 'test', username: 'test', password: 'pwdpwdpwd' })

      const user = await api
         .post('/api/login')
         .send({ username: 'test', password: 'pwdpwdpwd' })
         .expect(200)
         .expect('Content-type', /application\/json/)

      await api
         .post('/api/blogs')
         .set('Authorization', `bearer ${user.body.token}`)
         .send(newBlog)
         .expect(400)
         .expect('Content-Type', /application\/json/)
   })
})

describe('Deleting blogs', () => {

   test('deleting a blog', async () => {
      await api.post('/api/users').send({
         name: 'test',
         username: 'test',
         password: 'pwdpwdpwd',
      })

      const user = await api
         .post('/api/login')
         .send({
            username: 'test',
            password: 'pwdpwdpwd',
         })
         .expect(200)
         .expect('Content-type', /application\/json/)

      const newBlog = {
         title: 'to be deleted',
         author: 'test',
         url: 'example.com',
         likes: 6,
      }
      let addedBlog = await api
         .post('/api/blogs')
         .set('Authorization', `bearer ${user.body.token}`)
         .send(newBlog)
         .expect(201)
         .expect('Content-Type', /application\/json/)

      await api
         .delete(`/api/blogs/${addedBlog.body.id}`)
         .set('Authorization', `bearer ${user.body.token}`)
         .expect(204)
   })
})

describe('Updating existing blogs ', () => {

   test('updating a blog', async () => {
      const tobeUpdated = await helper.createNewBlog()
      let newLikes = 6
      const newBlog = {
         title: 'new test blog',
         author: 'test',
         url: 'example.com',
         likes: newLikes,
      }
      await api
         .put(`/api/blogs/${tobeUpdated}`)
         .send(newBlog)
         .expect(200)

      const finalBlogs = await helper.allBlogs()
      const updated = finalBlogs.find(b => b.id == tobeUpdated)
      expect(updated.title).toBe('new test blog')
      expect(updated.likes).toBe(newLikes)
   })
})

afterAll(() => {
   mongoose.connection.close()
})

