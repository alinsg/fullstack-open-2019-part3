const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let notes = [
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

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${[port]}`)
})

app.get('/', (req, res) => {
  const infoHref = 'info'
  res.send(`
    <h1>Phonebook</h1>
    <h3>Useful links:</h3>
    <ul>
      <li><a href=${infoHref}>Info</a></li>
    </ul>
  `)
})

app.get('/info', (req, res) => {
  const time = Date()
  res.send(`
    <p>Phonebook has info for ${notes.length} people</p>
    <p>${time}</p>
  `)
})
