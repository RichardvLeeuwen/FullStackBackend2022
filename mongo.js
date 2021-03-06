const mongoose = require('mongoose')

if (process.argv.length < 3) { //as shown in part 3 mongoDB example
  console.log('Please provide a password')
  process.exit(1)
}

const password = process.argv[2]

const url =  `mongodb+srv://fullstackrvl:${password}@cluster0.0kp8u.mongodb.net/phoneBook?retryWrites=true&w=majority`
mongoose.connect(url)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if(process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })
  person.save().then(() => {
    mongoose.connection.close()
  })
}
else {
  console.log('Phonebook:')
  Person.find({}).then(res => {
    res.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}
