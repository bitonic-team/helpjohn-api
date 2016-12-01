'use strict';

const express = require('express');
const config = require('./config/server');



const app = express();

app.get('/health', (req, res) => {
    res.end()
});

app.listen(config.port, (err) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening on port ${config.port}`);
});






