'use strict';
const express = require('express');
const pino = require('pino')({name:'Items'});

const {db} = require('../db');
const config = require('../config');

module.exports = {};

const itemsRouter = module.exports.router = express.Router();

itemsRouter.get('/', (req, res, next) => {
    let query = `SELECT * FROM items `;

    if(req.query.zone){
        query += ` WHERE zone = '${req.query.zone}'`;
    }


    return db.query(query, (err, users) => {
        if(err) {
            return next(err);
        }
        return res.json(users);
    });
});


