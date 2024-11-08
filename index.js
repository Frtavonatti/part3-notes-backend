// MIDDLEWARE
const express  = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
require('dotenv').config()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content '))

// MODELS
const Person = require('./models/person')

// ROUTES
// GET all
app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(persons => {
        res.json(persons)
      })
})

// GET person by ID
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: 'The ID that you requested does not exist' });
      }
    })
    .catch(error => next(error)); 
})


// POST
app.post('/api/persons', (req, res) => {
  const newName = req.body.name
  const newNumber = req.body.number
  
  if (!newName || !newNumber) {
    res.status(400).json({ error: 'Name and Number are required params' })
    console.error('Name and Number are required params')
    return
  } 
  
  const newPerson = new Person({
    name: newName, 
    number: newNumber
  })

  newPerson.save().then(savedPerson => {
    console.log(`${savedPerson} successfully added`)
    res.status(201).json(savedPerson)
  })
})


//PUT
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then(res.status(200).json(updatedPerson))
    .catch(error => next(error))
})


// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then(personToDelete => {
      if (personToDelete) {
        res.status(204).json(personToDelete);
        console.log(`${personToDelete.name} deleted`);
      } else {
        res.status(404).json({ error: 'The ID that you requested does not exist' });
      }
    })
    .catch(error => next(error)); 
})


// MIDLEWARE
//Error Handler
app.use((error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
})

// PORT CONECTION
const PORT = process.env.PORT 
app.listen(PORT,  () => {
    console.log(`Server running on port ${PORT}`);
})