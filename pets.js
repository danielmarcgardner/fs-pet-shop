#!/usr/bin/env node
'use strict'

const fs = require('fs');
const path = require('path');
const petsPath = path.join('./', 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Uh oh something happened here!");
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const index = process.argv[3];
    if (!index) {
      console.log(pets);
    }
    else if (pets[index] === undefined){
      console.error(`Usage: ${node} ${file} read INDEX`)
    }
    else {
      console.log(pets[index]);
    }
  });
}
else if (cmd === 'create'){
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Uh oh cannot write here!");
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const ageInput = process.argv[3];
    const kindInput = process.argv[4];
    const nameInput = process.argv[5];

    if (!ageInput || !kindInput || !nameInput) {
      console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
      process.exit(1);
    }
    else {
      const pet = { age: Number(ageInput), kind: kindInput, name: nameInput};
      pets.push(pet);
      let petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) {
          console.error("Uh oh error saving here!");
        }
          console.log(pet);
      });
    }

  });
}

else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Uh oh cannot write here!");
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const index = process.argv[3];
    const ageInput = process.argv [4];
    const kindInput = process.argv[5];
    const nameInput = process.argv[6];
    if (!index || !ageInput || !kindInput || !nameInput) {
      console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
      process.exit(1);
    }
    else {
      const updatedPet = { age: Number(ageInput), kind: kindInput, name: nameInput};
      pets[index]= updatedPet;
      const petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) {
          console.error("Uh oh error saving here!");
        }
          console.log(updatedPet);
      });
    }
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Uh error destroying!");
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const index = process.argv[3];
    if (!index) {
      console.error(`Usage: ${node} ${file} destroy INDEX`);
      process.exit(1);
    }
    else {
    const deletedPet = pets[index];
    pets.splice(index, 1);
    const petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) {
        console.error("Uh oh error saving here!");
      }
        console.log(deletedPet);
      });
    }
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
