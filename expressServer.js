'use strict'

const fs = require('fs');
const path = require('path');
const petsPath = path.join('./pets.json');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    const id = Number(req.params.id);

    if (pets[id] !== undefined) {
      res.set('Content-Type', 'application/json');
      res.send(pets[id]);
    }
    else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(404);
    }
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    if (!req.body.age || !req.body.kind || !req.body.name || isNaN(req.body.age)) {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(400);
    }
    else {
      const pets = JSON.parse(data);
      const newPet = { age: req.body.age, kind: req.body.kind, name: req.body.name };
      pets.push(newPet)
      const petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) {
          console.error(err.stack);
          return res.sendStatus(500);
        }
        res.send(newPet);
      });
    }
  });
});

app.use((req, res) => {
  res.sendStatus(404);
})

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
