const express = require('express')
const app = express()
const cors = require('cors')
const { User, Exercise } = require('./models')
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

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    let {description, duration, date} = req.body
    const UID = req.params._id

    if (!date || date === '' || date === null) {
      date = new Date()
    } else {
      let dateBody = date
      let newDate = new Date(dateBody)
      date = newDate
    }

    let durInt = parseInt(duration)

    let insert = await Exercise.create({
      user_id: UID,
      description: description,
      duration: durInt,
      date: date
    })

    let user = await User.findById(UID)

    return res.json({
      username: user.username,
      description: insert.description,
      duration: insert.duration,
      date: insert['date'].toDateString(),
      _id: user._id
    })
  } catch (error) {
    res.status(500).send({
      msg:"Error",
      err: error.message
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

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    let {from, to, limit} = req.query
    limit = parseInt(limit)

    let data = await User.findOne({_id: req.params._id}).populate({
      path: 'exer',
      date: { $gte: from, $lte: to },
      options: {limit: limit}
    })

    let logs = []
    for (let i=0; i < data['exer'].length; i++) {
      let result = {
        description: data['exer'][i].description,
        duration: data['exer'][i].duration,
        date: data['exer'][i]['date'].toDateString()
      }

      logs.push(result)
    }

    if (from && to && limit) {
      let fromDate = new Date(from)
      let toDate = new Date(to)

      return res.json({
        _id: data._id,
        username: data.username,
        from: fromDate.toDateString(),
        to: toDate.toDateString(),
        count: data['exer'].length,
        _id: data._id,
        log: logs
      })
    }

    return res.json({
      _id: data._id,
      username: data.username,
      count: data['exer'].length,
      _id: data._id,
      log: logs
    })
  } catch (error) {
    res.status(500).send({
      err: error.message
    })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
