'use strict';
const express = require('express');
const async = require('neo-async');
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

itemsRouter.delete('/:id', authNeeded, (req, res, next) => {
    db.query(`DELETE FROM items WHERE id='${req.params.id}'`, (err) => {
        if(err) return next(err);
        return getItems({zone: req.user.zone}, (err, items) => {
            if(err) {
                return next(err);
            }
            pino.debug(`Item ${req.body.name} deleted by ${req.user.email}`);
            return res.status(200).json(items);
        })
    })
});

itemsRouter.put('/', authNeeded, (req, res, next) => {
    async.forEachOf(req.body, (item, priority,  done) => {
        item.priority = priority;
        delete item.amount;
        const query = `UPDATE items SET ? WHERE id='${item.id}'`;
        pino.trace(`MySQL Get Items : ${query}`);
        db.query(query, item, done)
    }, (err, result) => {
        if(err) return next(err);
        return getItems({zone: req.user.zone}, (err, items) => {
            if(err) {
                return next(err);
            }
            return res.status(200).json(items);
        })
    })
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
        pino.debug(`Item ${req.body.name} created by ${req.user.email}`, item);

        getItems({zone: req.user.zone}, (err, items) => {
            if(err) {
                return next(err);
            }
            return res.status(201).json(items);
        });
    });
});

function getItems(filters, done){
    let query = `
    SELECT 
        i.id as id,
        i.name as name,
        i.daily as daily,
        i.zone as zone,
        i.price as price,
        i.tag as tag,
        i.priority as priority,
        d.amount as amount
    FROM items as i 
`;

    query += ` 
    LEFT JOIN (
        SELECT SUM(amount) as amount, item FROM donations GROUP BY item
    ) as d
    ON d.item = i.id
    `;

    const filtersNames = Object.keys(filters);

    if(filtersNames.length){
        query += filtersNames.reduce((acc, curr) => {
            return `${acc} ${curr} = '${filters[curr]}'`;
        }, ' WHERE ');
    }
    query += ' ORDER BY priority';

    pino.trace(`MySQL Get Items : ${query}`);
    return db.query(query, done)
}
