const express = require('express')
var cors = require('cors')
const app = express()
const port = 8080
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:password@host.docker.internal:5432/ORbaza')
//const db = pgp('postgres://postgres:password@localhost:5432/ORbaza')


const api = require("./openapi.json")

app.use(cors())
app.use(express.json())

function toLD(data) {
  let LD = {
    "@context": "https://schema.org",
    "@type": "Place",
    "identifier": data.id,
    "name": data.name,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.latitude,
      "longitude": data.longitude,
      "elevation": data.elevation,
    },
    "additionalProperty": [
      {
        "name": "datesetup",
        "value": data.datesetup
      },
      {
        "name": "isactive",
        "value": data.isactive
      },
      {
        "name": "isautomatic",
        "value": data.isautomatic
      }
    ]
  }
  return LD;
}

const errorResponse = {
  "status": "Error",
  "message": "An unknown error has occured!",
  "response": null,
}

const notFoundResponse = {
  "status": "Not Found",
  "message": "No item with such properties found",
  "response": null,
}

const invalidResponse = {
  "status": "Invalid Parameters",
  "message": "Invalid paramteres. Please check parameters",
  "response": null,
}

const notImplemented = {
  "status": "Not Implemented",
  "message": "Method not implemented",
  "response": null,
}

app.get('/oldData', async (req, res) => {
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

app.get('/data', async (req, res) => {
  try {
    let data = await db.query('SELECT station.*, timestamp, value, interval FROM station LEFT JOIN recording ON station.id::integer = stationid::integer')

    res.send({
      "status": "OK",
      "message": "Fetched data",
      "response": data,
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }  
})

app.get('/recordings/getByDay', async (req, res) => {
  try {
    let date = req.query.Date;

    if (date == undefined) {
      res.status(400).send(invalidResponse)
      return
    }

    let data = await db.query(`SELECT * FROM recording WHERE timestamp::date = '${date}'`)

    if (data.length == 0) {
      res.status(404).send(notFoundResponse)
      return
    }
    res.send({
      "status": "OK",
      "message": "Fetched recordings",
      "response": data,
    })
  }
  catch (err) {
    res.status(500).send(errorResponse);
  }
})

app.get('/station/findByName', async (req, res) => {
  try {
    let name = req.query.name;

    if (name == undefined) {
      res.status(400).send(invalidResponse)
      return
    }

    let data = await db.query(`SELECT * FROM station WHERE name LIKE '${name}'`);

    if (data.length == 0) {
      res.status(404).send(notFoundResponse);
      return
    }

    data = data.map((station) => (toLD(station)))

    res.send({
      "status": "OK",
      "message": "Fetched stations",
      "response": data,
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }
})

app.get('/station/:stationId', async (req, res) => {
  try {
    let stationId = req.params.stationId

    if (isNaN(parseInt(stationId))) {
      res.status(400).send(invalidResponse)
      return
    }

    data = await db.query(`SELECT * FROM station WHERE id = ${stationId}`);

    if (data.length == 0) {
      res.status(404).send(notFoundResponse)
      return
    }
    data = data[0]

    data = toLD(data)

    res.send({
      "status": "OK",
      "message": "Fetched station",
      "response": data,
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }
})

app.get('/station/:stationId/recordings', async (req, res) => {
  try {
    let stationId = req.params.stationId

    if (isNaN(parseInt(stationId))) {
      res.status(400).send(invalidResponse)
      return
    }

    data = await db.query(`SELECT recording.* FROM station RIGHT JOIN recording ON station.id = stationid WHERE id = ${stationId}`);

    if (data.length == 0) {
      res.status(404).send(notFoundResponse)
      return
    }
    res.send({
      "status": "OK",
      "message": "Fetched station",
      "response": data,
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }
})

app.post('/station', async (req, res) => {
  try {
    if (req.body == undefined || !("id" in req.body && "name" in req.body && "latitude" in req.body && "longitude" in req.body && "elevation" in req.body
                                && "datesetup" in req.body && "isautomatic" in req.body && "isactive" in req.body
    )) {
      res.status(400).send(invalidResponse)
      return
    }

    await db.none(`INSERT INTO station VALUES (${req.body.id}, '${req.body.name}', ${req.body.latitude}, ${req.body.longitude}
      , ${req.body.elevation}, '${req.body.datesetup}'::timestamp, ${req.body.isautomatic}, ${req.body.isactive})`);

    res.send({
      "status": "OK",
      "message": "Successfully added station",
      "response": null
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }
})

app.put('/station/:stationId', async (req, res) => {
  try {
    if (req.body == undefined || !("id" in req.body && "name" in req.body && "latitude" in req.body && "longitude" in req.body && "elevation" in req.body
                                && "datesetup" in req.body && "isautomatic" in req.body && "isactive" in req.body
      )) {
      res.status(400).send(invalidResponse)
      return
    }

    let stationId = req.params.stationId

    if (isNaN(parseInt(stationId))) {
      res.status(400).send(invalidResponse)
      return
    }

    await db.none(`UPDATE station SET (name, latitude, longitude, elevation, datesetup, isactive, isautomatic) = 
	    ('${req.body.name}',${req.body.latitude}, ${req.body.longitude}, ${req.body.elevation}, '${req.body.datesetup}'::timestamp, ${req.body.isautomatic},${req.body.isactive})
	    WHERE id = ${stationId};`)

    res.send({
      "status": "OK",
      "message": "Successfully modified station",
      "response": null
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }
})

app.delete('/station/:stationId', async (req, res) => {
  try {
    let stationId = req.params.stationId

    if (isNaN(parseInt(stationId))) {
      res.status(400).send(invalidResponse)
      return
    }

    await db.none(`DELETE FROM station WHERE id = ${stationId};`);

    res.send({
      "status": "OK",
      "message": "Successfully deleted station",
      "response": null
    })
  }
  catch (err) {
    res.status(500).send(errorResponse)
  }
})

app.get('/api', (req, res) => {
  res.send(api)
})

app.all('/*', (req, res) => {
  res.status(501).send(notImplemented)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

