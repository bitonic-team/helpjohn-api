'use strict';
const express = require('express');
const async = require('neo-async');
const pino = require('pino')({
    name:'Donations',
    level: 'trace'
});

const {db} = require('../db');
const {getItems} = require('../items');
const config = require('../config');

module.exports = {};

const donationsRouter = module.exports.router = express.Router();

donationsRouter.get('/', (req, res, next) => {

    getDonations(req.query, (err, donations) =>{
        if(err) {
            return next(err);
        }
        return res.json(donations);
    });
});



donationsRouter.post('/', (req, res, next) => {

    const donation = req.body;
    let query = `INSERT INTO donations SET ?`;

    return db.query(query, donation,(err, result) => {
        if(err) {
            return next(err);
        }
        pino.debug(` ${donation.name} donate ${donation.amount} € for item ${donation.item}`, donation);

        return getItems(null, (err, items) => {
            if(err) {
                return next(err);
            }
            return res.json(items);
        });
    });
});



function getDonations(filters, done){
    let query = `SELECT * FROM donations `;

    const filtersNames = Object.keys(filters);

    if(filtersNames.length){
        query += filtersNames.reduce((acc, curr) => {
            return `${acc} ${curr} = '${filters[curr]}'`;
        }, ' WHERE ');
    }

    pino.trace(`MySQL Get Donations : ${query}`);
    return db.query(query, done)
}
