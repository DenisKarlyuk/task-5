const ENV = process.env.NODE_ENV||NODE_ENV;
module.exports = require('./webpack/'+ENV);
