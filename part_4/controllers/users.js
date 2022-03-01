require('express-async-errors')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const Logger = require('../utils/logger')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
   const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
   response.json(users)
})

usersRouter.post('/', async (request, response) => {
   const body = request.body
   if (!body.password || body.password.length < 3) {

      Logger.error('User creation failed: password should be longer than 3 characters.')
      response.status(400)
      response.json({ error: 'password length must be at least 3' })
   }
   else {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
         username: body.username,
         name: body.name,
         passwordHash,
      })

      const savedUser = await user.save()
      Logger.info('saved', savedUser)
      response.json(savedUser)
   }
})

usersRouter.delete('/:id', async (request, response) => {
   await User.findByIdAndRemove(request.params.id)
   response.status(204).end()
})

module.exports = usersRouter

