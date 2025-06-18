const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000

const { typeError } = require('./middlewares/errors')

mongoose.connect('mongodb://localhost:27017/Proyecto2')

app.use(express.json())

app.use('/users', require('./routes/users'))
app.use('/posts', require('./routes/posts'))
app.use('/comments', require('./routes/comments'))

app.use(typeError)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})