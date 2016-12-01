'use strict';

module.exports = {
    server: {
        port: 8765
    },
    mysql: {
        host: process.env.db || 'localhost',
        user: process.env.user ||'root',
        password: process.env.pass || '',
        database: 'john'
    }
};