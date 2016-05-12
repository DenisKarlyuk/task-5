if(process.env.NODE_ENV==='prod') {
  module.exports = require('./prod.conf')
}
else {
  module.exports = require('./dev.conf')
}
