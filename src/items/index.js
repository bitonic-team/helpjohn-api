'use strict';
const express = require('express');
const pino = require('pino')({
    name:'Items',
    level: 'trace'
});

const {db} = require('../db');
const {authNeeded} = require('../users');
const config = require('../config');

module.exports = {};

const itemsRouter = module.exports.router = express.Router();

itemsRouter.get('/', (req, res, next) => {
    let query = `SELECT * FROM items `;

    const filters = Object.keys(req.query);

    if(filters.length){
        query += filters.reduce((acc, curr) => {
            return `${acc} ${curr} = '${req.query.curr}'`;
        }, ' WHERE ');
    }

    return db.query(query, (err, users) => {
        if(err) {
            return next(err);
        }
        return res.json(users);
    });
});


itemsRouter.post('/', authNeeded, (req, res, next) => {
    pino.trace(`Item ${req.body.name} created by ${req.user.email}`, req.body);

    const item = Object.assign({
        zone: req.user.zone
    }, req.body);
    let query = `INSERT INTO items SET ?`;

    return db.query(query, item,(err, item) => {
        if(err) {
            return next(err);
        }
        return res.status(201).json(item);
    });
});


