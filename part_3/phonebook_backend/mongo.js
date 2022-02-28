const mongoose = require('mongoose')

if (process.argv.length < 3) {
   console.log('Usage: node mongo.js <password> [username] [phone number]')
   process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@fullstack.szjfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
   name: String,
   number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
   console.log('The data entries are:')
   Person.find({}).then(result => {
      result.forEach(person => {
         console.log(person)
      })
      mongoose.connection.close()
   })
   process.exit(0)
}

if (process.argv.length === 4) {
   console.log('Please add phonenumber')
   process.exit(1)
}

if (process.argv.length === 5) {
   const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
   })

   person.save().then(() => { //result passed here
      console.log('Added name and number to phonebook')
      mongoose.connection.close()
   })
}

if (process.argv.length > 5) {
   console.log('Please check the number of arguments')
   process.exit(1)
}

