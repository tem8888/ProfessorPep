var pg = require('pg');

var config = {
        port: 5432,
        host: "ec2-54-247-171-30.eu-west-1.compute.amazonaws.com",
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: true 
};


var pool = new pg.Pool(config);
module.exports = pool;