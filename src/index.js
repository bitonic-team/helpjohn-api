'use strict';

const express = require('express');
const pino = require('pino')({
    name:'Server',
    level: 'trace'
});

const config = require('./config');
const users = require('./users');





const app = express();
app.use(requestLogger);
app.use('/users', users.router);
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
    pino.debug(`${req.method} ${req.path}`);
    return next();
}

function errorHandler(err, req, res, next){
    pino.error(err);
    res.statusCode(500).end();
    return next();
}


