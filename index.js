const express = require('express')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ac2255:${password}@fullstack.julv8.mongodb.net/noteApp?retryWrites=true&w=majority&appName=FullStack`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

let notes = [
    {    id: "1",    content: "HTML is hard",    important: true  },
    {    id: "2",    content: "Browser can execute only JavaScript",    important: false  },
    {    id: "3",    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }
]

app.get('/', (request, response) => {
    response.send('<h1>HELLO WORLD!!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if(note){
        response.json(note)
    } else {
        response.status(404).end()
    }
  })

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0

    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content : body.content,
        important : Boolean(body.important) || false,
        id : generateId()
    }

    notes = notes.concat(note)
    response.json(notes)
})




app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
