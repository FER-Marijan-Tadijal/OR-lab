const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const { auth, requiresAuth } = require('express-openid-connect');
const fs = require("fs")

const config = {
  authRequired: false,
  auth0Logout: false,
  baseURL: 'http://localhost:3000',
  clientID: '9h8pvDemVoUN8uiDhEu3YEZ3hXJPLOrD',
  issuerBaseURL: 'https://dev-hlpv1njhak1gcz56.eu.auth0.com',
  secret: 'VERY_LONG_VERY_RANDOM_STRING_AKSBFSHDFHSFDKHFDS_NOT_VERY_SAFE'
};

app.use(auth(config))

app.get('/', (req, res) => {
  res.render("index.ejs", {signedIn: req.oidc.isAuthenticated()});
})

app.get('/profile', (req, res) => {
  if (!(req.oidc.user)) {
    res.send("Not authorized!")
    return
  }
  res.render("profile.ejs", {profileData: req.oidc.user})
});

app.get('/refresh', async (req, res) => {
  if (!(req.oidc.user)) {
    res.send("Not authorized!")
    return
  }

  const jsonPath = path.join(__dirname,"public/OR-lab.json")
  const csvPath = path.join(__dirname, "public/OR-lab.csv")

  const response = await fetch("http://backend:8080/data");
  const json = await response.json();

  let newData = json.response;

  let csvBody = ""
  let first = true;
  for (let key in newData[0]) {
    if (!first) csvBody += ",";
    else first = false
    csvBody += key;
  }
  csvBody = csvBody + "\n"
  for (let line of newData) {
    for (let element in line) {
      if (element == "interval") {
        let strDays;
        if (line[element] == null) {
          strDays = "null"
        } else {
          let days = line[element].days;
          strDays = "" + days + ((days > 1) ? " days" : " day")
        }
        csvBody += strDays;
      } else {
        csvBody += line[element] + ",";
      }
    }
    csvBody += "\n";
  }

  fs.writeFileSync(jsonPath, JSON.stringify(newData));
  fs.writeFileSync(csvPath, csvBody)

  res.redirect("/")
});

//app.use(express.static('public'))
app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})