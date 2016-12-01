'use strict';

const mysql = require('mysql');
const pino = require('pino')({name:'DB'});

const config = require('../config');


const db = mysql.createConnection(config.mysql);


db.connect((err) => {
    if(err){
        pino.error(`Fail to connect to DB`, err);
        process.exit(1);
    }
    return pino.info(`Connected to DB`);
});


module.exports = {db};
