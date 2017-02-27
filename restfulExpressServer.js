'use strict'

const fs = require('fs');
const path = require('path');
const petsPath = path.join('./pets.json');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const morgan = require('morgan')
app.use(bodyParser.json());
app.use(morgan('short'))
const basicAuth = require('basic-auth');

const auth =  (req, res, next) => {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm="Required"');
    return res.send(401);
  }

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'admin' && user.pass === 'meowmix') {
    return next();
  }
  else {
    return unauthorized(res);
  };
};

app.use(auth)

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
  let id = Number(req.params.id);
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    let id = Number(req.params.id);
    if (pets[id] !== undefined) {
      res.set('Content-Type', 'application/json');
      res.send(pets[id]);
    }
    else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(404);
    }
  })
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
      let newPet = { age: req.body.age, kind: req.body.kind, name: req.body.name }
      pets.push(newPet);
      let petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) {
          console.error(err.stack);
          return res.sendStatus(500);
        }
        res.send(newPet)
      });
    }
  });
});

app.patch('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    let id = Number(req.params.id);
    let pet = pets[id]
    if (pets[id] === undefined) {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(400);
    }
    else if (pets[id] !== undefined) {
      if (req.body.kind) {
        pet.kind = req.body.kind;
      }
      if (req.body.age && !isNaN(req.body.age)) {
        pet.age = req.body.age;
      }
      if (req.body.name) {
        pet.name = req.body.name;
      }
    }
    let petsJSON = JSON.stringify(pets)
    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      res.send(pet);
    });
  });
});

app.delete('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    const id = Number(req.params.id);
    const pet = pets[id]
    if (pets[id] === undefined) {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(400);
    }
    else {
      pets.splice(id, 1);
      const petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) {
          console.error(err.stack);
          return res.sendStatus(500);
        }
        res.send(pet);
      });
    }
  });
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
