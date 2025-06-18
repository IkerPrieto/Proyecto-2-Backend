const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000

mongoose.connect('mongodb://localhost:27017/Proyecto2')

app.use(express.json())

app.use('/users', require('./routes/users'))
app.use('/posts', require('./routes/posts'))
app.use('/comments', require('./routes/comments'))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})