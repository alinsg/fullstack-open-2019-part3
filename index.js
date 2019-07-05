require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

//Morgan setup
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))
//Error handler middleware setup

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'Cast error' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformated id' })
  }
  next(error)
}

app.use(errorHandler)

//Express setup
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
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'The name or the number of the person is missing'
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})
