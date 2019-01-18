const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/driver', (req, res) => {
  res.send({
      "activeLegID": "FG",
      "legProgress": "33"
  })
})

app.get('/stops', (req, res) => {
  res.send([
    {"name": "A", "x": 20, "y": 10},
    {"name": "B", "x": 20, "y": 20},
    {"name": "C", "x": 25, "y": 30},
    {"name": "D", "x": 25, "y": 80},
    {"name": "E", "x": 30, "y": 100},
    {"name": "F", "x": 35, "y": 80},
    {"name": "G", "x": 35, "y": 30},
    {"name": "H", "x": 40, "y": 20},
    {"name": "I", "x": 40, "y": 10},
    {"name": "J", "x": 35, "y": 15},
    {"name": "K", "x": 25, "y": 15},
    {"name": "L", "x": 20, "y": 10}
  ])
})

app.get('/legs', (req, res) => {
  res.send([{
    "startStop":"A",
    "endStop":"B",
    "speedLimit":100,
    "legID":"AB"
  },
  {
    "startStop":"B",
    "endStop":"C",
    "speedLimit":60,
    "legID":"BC"
  },
  {
    "startStop":"C",
    "endStop":"D",
    "speedLimit":80,
    "legID":"CD"
  },
  {
    "startStop":"D",
    "endStop":"E",
    "speedLimit":120,
    "legID":"DE"
  },
  {
    "startStop":"E",
    "endStop":"F",
    "speedLimit":40,
    "legID":"EF"
  },
  {
    "startStop":"F",
    "endStop":"G",
    "speedLimit":40,
    "legID":"FG"
  },
  {
    "startStop":"G",
    "endStop":"H",
    "speedLimit":100,
    "legID":"GH"
  },
  {
    "startStop":"H",
    "endStop":"I",
    "speedLimit":100,
    "legID":"HI"
  },
  {
    "startStop":"I",
    "endStop":"J",
    "speedLimit":50,
    "legID":"IJ"
  },
  {
    "startStop":"J",
    "endStop":"K",
    "speedLimit":100,
    "legID":"JK"
  },
  {
    "startStop":"K",
    "endStop":"L",
    "speedLimit":60,
    "legID":"KL"
  }]);
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));