require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// set up morgan for logging requests
morgan.token('postBody', (req) => {
   if (req.method === 'POST') return JSON.stringify(req.body)
   return ''
})
app.use(
   morgan(
      ':method :url :postBody :status :res[content-length] - :response-time ms'
   )
)

// random generation of id for entries
const generateId = () => {
   return Math.floor(Math.random() * 1000000)
}

// info page
app.get('/api/info', (request, response, next) => {
   // number of entries
   Person.estimatedDocumentCount()
      .then((count) => {
         response.send(
            `<h2>Phonebook has info for ${count} people</h2> <p>@ ${new Date()}</p>`
         )
      })
      .catch((error) => next(error))
})

// add new person
app.post('/api/persons', (request, response, next) => {
   const body = request.body

   if (!body.name) {
      return response.status(400).json({
         error: 'name is missing',
      })
   } else if (!body.number) {
      return response.status(400).json({
         error: 'number is missing',
      })
   }

   const person = new Person({
      id: generateId(),
      name: body.name,
      number: body.number,
   })

   person
      .save()
      .then((savedPerson) => {
         response.json(savedPerson)
      })
      .catch((error) => next(error))
})


// get a single person by id
app.get('/api/persons/:id', (request, response, next) => {
   Person.findById(request.params.id)
      .then((person) => {
         if (person) {
            response.json(person)
         } else {
            response.status(404).end()
         }
      })
      .catch((error) => next(error))
})

// get all entries
app.get('/api/persons', (request, response, next) => {
   Person.find({})
      .then((people) => {
         response.json(people)
      })
      .catch((error) => next(error))
})

// delete a person
app.delete('/api/persons/:id', (request, response, next) => {
   Person.findById(request.params.id)
      .then((person) => {
         person.remove()
            .then(() => {
               response.status(204).end()
            })
      })
      .catch((error) => next(error))
})

// update a person by id
app.put('/api/persons/:id', (request, response, next) => {
   const body = request.body

   const person = {
      name: body.name,
      number: body.number,
   }

   Person.findByIdAndUpdate(request.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
   )
      .then((updatedPerson) => {
         response.json(updatedPerson)
      })
      .catch((error) => next(error))
})

// api 404s
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// error handling
const errorHandler = (error, request, response, next) => {
   console.error(error.message)

   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
   } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
   }
   next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`)
})

