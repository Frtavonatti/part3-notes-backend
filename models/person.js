const mongoose = require('mongoose')

mongoose.set('strictQuery',false) // Mongoose permitirá consultas que incluyan campos que no están definidos en el esquema del modelo.

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(result => { 
        console.log('connected to mongoDB')
})  .catch(error => {    
    console.log('error connecting to MongoDB:', error.message)  
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)
