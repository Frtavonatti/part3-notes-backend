const mongoose = require('mongoose')

mongoose.set('strictQuery',false) // Mongoose permitirá consultas que incluyan campos que no están definidos en el esquema del modelo.

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to mongoDB')
    })  .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        // Validador personalizado
        validate: {
            validator: function(value) {
                // Dividir el número en partes usando el guion como separador
                const parts = value.split('-')
                // Verificar que haya exactamente dos partes
                if (parts.length !== 2) {
                    return false
                }
                // Verificar que la primera parte tenga 2 o 3 dígitos
                const part1 = parts[0]
                if (part1.length < 2 || part1.length > 3 || isNaN(part1)) {
                    return false
                }
                // Verificar que la segunda parte tenga solo dígitos
                const part2 = parts[1]
                if (isNaN(part2)) {
                    return false
                }
                return true
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
