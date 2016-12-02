'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino')({
    name:'Server',
    level: 'trace'
});

const config = require('./config');
const users = require('./users');
const zones = require('./zones');
const items = require('./items');
const donations = require('./donations');


const app = express();
app.use(cors);
app.use(requestLogger);
app.use(bodyParser.json());
app.use(users.getSession);
app.use('/users', users.router);
app.use('/zones', zones.router);
app.use('/items', items.router);
app.use('/donations', donations.router);
app.use(errorHandler);

app.get('/health', (req, res) => {
    res.end()
});



app.listen(config.server.port, (err) => {
    if(err){
        pino.error(err);
        process.exit(1);
    }
    pino.info(`Server listening on port ${config.server.port}`);
});

function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", ["helpjohn.xyz","*"]);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    return next();
}

function requestLogger(req, res, next){
    const t = Date.now();
    res.on('finish', () => {
        pino.trace(`${res.statusCode} ${req.method} ${req.originalUrl} - ${Date.now() -t}ms`);
    });
    return next();
}

function errorHandler(err, req, res, next){
    pino.error(err);
    res.status(500).end();
    return next();
}


