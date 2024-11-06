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
// GET
app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(persons => {
        res.json(persons)
      })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
        res.json(person)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error: 'The ID that you requested does not exist' })
    })
})


// POST
app.post('/api/persons', (req, res) => {
  const newName = req.body.name
  const newNumber = req.body.number
  
  if (!newName || !newNumber) {
    res.status(400).json({ error: 'Name and Number are required params' })
    console.error('Name and Number are required params')
    return
  } else if (persons.some(person => person.name === newName)) {
    res.status(400).json({ error: 'Name must be unique' })
    console.error('Name must be unique')
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


// DELETE
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then(personToDelete => {
      res.status(204).json(personToDelete)
      console.log(`${personToDelete.name} deleted`)
    })
    .catch(error => {
      res.status(404).json({ error: 'The ID that you requested does not exist' })
      console.error('The ID that you requested does not exist')
    })
})

const PORT = process.env.PORT 
app.listen(PORT,  () => {
    console.log(`Server running on port ${PORT}`);
})