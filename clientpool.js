var pg = require('pg');

var config = {
        port: 5432,
        host: "ec2-54-247-171-30.eu-west-1.compute.amazonaws.com",
        database: "d7qglb2p2tfh1r",
        user: "bwcvyvshzsuuqm",
        password: "10072d3367cbf49aa08b89c769beb473f18c5965ee44434898c44adacfd90551",
        ssl: true 
};


var pool = new pg.Pool(config);
module.exports = pool;