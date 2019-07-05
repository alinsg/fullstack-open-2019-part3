const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${[port]}`)
})

app.get('/', (req, res) => {
  const infoHref = 'info'
  const personsHref = 'api/persons'
  res.send(`
    <h1>Phonebook</h1>
    <h3>Useful links:</h3>
    <ul>
      <li><a href=${infoHref}>Info</a></li>
      <li><a href=${personsHref}>Persons</a></li>
    </ul>
  `)
})

app.get('/info', (req, res) => {
  const time = Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number.parseInt(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number.parseInt(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const generateId = data => {
  return Math.floor(Math.random() * Math.floor(10000))
}

const personAlreadyAdded = personName => {
  return persons.some(person => person.name === personName)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'The name or the number of the person is missing'
    })
  } else if (personAlreadyAdded(body.name)) {
    return res.status(400).json({
      error: 'This person already exists in the phonebook'
    })
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
    persons = [...persons, person]
    res.json(person)
  }
})
