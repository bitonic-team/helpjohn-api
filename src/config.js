'use strict';

const pino = require('pino')({
    name:'Config',
    level: 'trace'
});

module.exports = {
    server: {
        port: process.env.port || 8765
    },
    mysql: {
        host: process.env.db || 'localhost',
        user: process.env.user ||'root',
        password: process.env.pass || '',
        database: 'john'
    }
};

pino.info('Config', module.exports);