const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('[+] Connecting to DB on: ', url)

mongoose.connect(url)
   .then(() => {
      console.log('[+] Connected to Mongodb Database')
   })
   .catch((error) => {
      console.log('[!] Error connecting to MongoDB: ', error.message)
   })

const personSchema = new mongoose.Schema({
   name: { type: String, minLength: 3, required: true, unique: true },
   number: {
      type: String, minLength: 8, required: true, validate: {
         // enforce a number that is in the form: 123-456789
         validator: function (num) {
            return /(\d{2,3})-\d{0,10}/.test(num)
         },
         message: props => `${props.value} is not a valid phone number!`
      }
   }
})

// remove extra info when converting to json
personSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
   }
})

module.exports = mongoose.model('persons', personSchema)

