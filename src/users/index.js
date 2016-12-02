'use strict';
const express = require('express');
const {v4} = require('node-uuid');
const md5 = require('md5');
const pino = require('pino')({name:'Users'});

const {db} = require('../db');
const config = require('../config');

module.exports = {
    authNeeded,
    getSession
};


const userRouter = module.exports.router = express.Router();


const sessions = {};

function getSession(req, res, next){
    req.user = sessions[req.header('Authorization')];
    next();
}

function authNeeded(req, res, next){
    if(!req.user){
        return res.status(400).json({
            err: 'Unauthorized'
        });
    }
    return next();
}


userRouter.get('/', authNeeded, (req, res, next) => {
    return db.query(`SELECT * FROM users`, (err, users) => {
        if(err) {
            return next(err);
        }
        return res.json(users);
    });
});



userRouter.post('/auth', (req, res, next) => {
    if(req.user){
        return res.json(req.user);
    }
    return db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, result) => {
        if(err) return next(err);
        const user = result[0];
        if(!user || user.password !== md5(req.body.password)){
            return res.status(400).json({
                err: `Unauthorized`
            });
        }

        user.token = v4();
        sessions[user.token] = user;

        return res.json(user);
    });
});


