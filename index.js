require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')


app.use(express.json())

morgan.token('reqbody', function (req) { //custom token
  return req.reqbody
})

app.use(express.static('build'))
app.use(assignBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody')) //uses tiny format + req body as instructed

function assignBody(req, res, next) { //convert body to json string
  const body = req.body
  req.reqbody = JSON.stringify(body)
  next()
}


app.get('/info', (request, response, next) => {
  let total = 0
  const date = new Date()
  Person.find({}).then(people => {
    total = people.length
    const reply = `<p>Phonebook has info for ${total}</p><p>${date}</p>`
    response.send(reply)
  })
    .catch(error => next(error))

})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => response.json(people))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => { //as shown in chapter 3, error handling
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name is missing missing' })
  }
  else if (!body.number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  const person = new Person({
    //id: Math.floor(Math.random() * 10000), //10 000 should be a large enough id range, old, no longer necessary with MongoDB
    name: body.name,
    number: body.number,
  })

  person.save().then(newPerson => response.json(newPerson))
    .catch(error => next(error))
})

const errorHndler = (error, request, response, next) => { //taken from tutorial chapter 3, moving error into middleware
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHndler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})