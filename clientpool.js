var pg = require('pg');

var config = {
        port: 5432,
        host: process.env.BD_HOST,
        database: process.env.BD_DATABASE,
        user: process.env.BD_USER,
        password: process.env.BD_PASSWORD,
        ssl: true 
};


var pool = new pg.Pool(config);
module.exports = pool;