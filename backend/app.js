const express = require('express')
var cors = require('cors')
const app = express()
const port = 8080
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:password@localhost:5432/ORbaza')

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/data', async (req, res) => {
    let data = await db.query('SELECT station.*, timestamp, value, interval FROM station JOIN recording ON station.id = stationid')

    let inArrayForm = []
    for (item of data) {
      let newArr = [item.id, item.name, item.latitude, item.longitude, item.elevation, item.datesetup, item.isactive, item.isautomatic, item.timestamp, item.value, item.interval.days]
      inArrayForm.push(newArr)
    }

    let result = {}
    result.data = inArrayForm
    res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})