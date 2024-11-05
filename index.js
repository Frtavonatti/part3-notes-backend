let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
  ]

  
// MIDDLEWARE
const express  = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content '))


// ROUTES
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

app.get('/info', (req, res) => {    
    res.send(`
        <h3>Phonebook has info for ${persons.length} people</h3>
        <p>Time: ${new Date().toString()} </p>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === Number(id))

  person 
  ? res.json(person)
  : res.status(404).json({ error: 'The ID that you requested does not exist' })
})

// Handling POST Requests
const createNewID = () => {
  const maxID = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0
  const newID = maxID + 1
  return newID
}

app.post('/api/persons', (req, res) => {
  console.log(req.body)
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

  const newPerson = {
    id: createNewID(),
    name: newName, 
    number: newNumber
  }

  persons = persons.concat(newPerson)
  console.log(`${newPerson.name} successfully added`);
  res.status(201).json(persons)
})

// Handling DELETE Requests
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const personToDelete = persons.find(person => person.id === id)
  
  if (personToDelete) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).json({ message: `${personToDelete.name} deleted` })
    console.log(`${personToDelete.name} deleted`)
  } else {
    res.status(404).json({ error: 'The ID that you requested does not exist' })
    console.error('The ID that you requested does not exist')
  }
})

const PORT = 3001 
app.listen(PORT,  () => {
    console.log(`Server running on port ${PORT}`);
})