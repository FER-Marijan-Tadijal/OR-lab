const express = require('express')
const app = express()
const port = 3000
const path = require('path')

/*
app.get('/', (req, res) => {
  res.sendfile('public/index.html');
})
*/

app.use(express.static('public'))
//app.use('/', express.static(path.join(__dirname, '../../lab2')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})