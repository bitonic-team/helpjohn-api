'use strict';
const express = require('express');
const pino = require('pino')({name:'Zones'});

const {db} = require('../db');
const config = require('../config');

module.exports = {};

const zonesRouter = module.exports.router = express.Router();

zonesRouter.get('/', (req, res, next) => {
    return db.query(`SELECT * FROM zones`, (err, users) => {
        if(err) {
            return next(err);
        }
        return res.json(users);
    });
});

