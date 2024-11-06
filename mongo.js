const mongoose = require('mongoose')

mongoose.set('strictQuery',false) // Mongoose permitirá consultas que incluyan campos que no están definidos en el esquema del modelo.


const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
  }

const url = (`mongodb+srv://frtavonatti:${password}@clusteragenda.btcobqt.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterAgenda`)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    // id: String,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


// REQUEST HANDLING
const getAllPersons = async () => {
    console.log('Phonebook:')

    await Person.find({}, 'name number')
    .then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    })
    .catch(error => {
        console.error(error);
        mongoose.connection.close();
    });
};

if (process.argv.length === 3) {
    getAllPersons();
} else if (process.argv.length === 4) {
    console.log('One argument is missing: you should add name & number')
    mongoose.connection.close()
} else if (process.argv.length === 5) {
    const person = new Person({
        name: newName,
        number: newNumber
    });

    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close();
    }).catch(error => {
        console.error(error);
        mongoose.connection.close();
    });
} else {
    console.log('You have to many arguments, there should be only 5')
    mongoose.connection.close();
}