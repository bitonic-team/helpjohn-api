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

    getItems(req.query, (err, items) =>{
        if(err) {
            return next(err);
        }
        return res.json(items);
    });
});


itemsRouter.post('/', authNeeded, (req, res, next) => {

    const item = Object.assign({
        zone: req.user.zone
    }, req.body);
    let query = `INSERT INTO items SET ?`;

    return db.query(query, item,(err, result) => {
        if(err) {
            return next(err);
        }
        pino.trace(`Item ${req.body.name} created by ${req.user.email}`, item);

        getItems({zone: req.user.zone}, (err, items) => {
            if(err) {
                return next(err);
            }
            return res.status(201).json(items);
        });
    });
});

function getItems(filters, done){
    let query = `SELECT * FROM items `;

    const filtersNames = Object.keys(filters);

    if(filtersNames.length){
        query += filtersNames.reduce((acc, curr) => {
            return `${acc} ${curr} = '${filters[curr]}'`;
        }, ' WHERE ');
    }

    return db.query(query, done)
}
