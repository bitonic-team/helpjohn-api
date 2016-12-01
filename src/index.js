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





const app = express();
app.use(requestLogger);
app.use(bodyParser.json());
app.use(users.getSession);
app.use('/users', users.router);
app.use('/zones', zones.router);
app.use('/items', items.router);
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

function requestLogger(req, res, next){
    const t = Date.now();
    res.on('finish', () => {
        pino.debug(`${res.statusCode} ${req.method} ${req.originalUrl} - ${Date.now() -t}ms`);
    });
    return next();
}

function errorHandler(err, req, res, next){
    pino.error(err);
    res.status(500).end();
    return next();
}


