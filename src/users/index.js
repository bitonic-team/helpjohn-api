'use strict';
const express = require('express');
const pino = require('pino')({name:'Users'});

const {db} = require('../db');
const config = require('../config');

module.exports = {};

const userRouter = module.exports.router = express.Router();

userRouter.get('/', (req, res, next) => {
    return db.query(`SELECT * FROM users`, (err, users) => {
        if(err) {
            return next(err);
        }
        return res.end(JSON.stringify(users));
    });
});


