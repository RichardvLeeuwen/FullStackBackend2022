const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

//heavily influenced by the example tutorial code in chapter 3 "Database configuration into its own module"

mongoose.connect(url).then(() => {   console.log('connected to MongoDB')  }).catch((error) => {  console.log('error connecting to MongoDB:', error.message)  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', { //cleans up id as shown in the tutorial
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)