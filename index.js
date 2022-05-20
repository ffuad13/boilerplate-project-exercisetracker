const express = require('express')
const app = express()
const cors = require('cors')
const { User } = require('./models')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  try {
    let insert = await User.create({
      username: req.body.username
    })

    return res.json({
      "username": insert.username,
      "_id": insert._id
    })
  } catch (error) {
    res.status(500).send({
      msg:"Error"
    })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    let data = await User.find()

    return res.json(data)
  } catch (error) {
    res.status(500).send({
      msg:"Error"
    })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
