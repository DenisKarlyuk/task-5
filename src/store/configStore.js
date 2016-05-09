
if((process.env.NODE_ENV||NODE_ENV)=='production') {
  module.exports = require('./configureStore.prod')
}
else {
  module.exports = require('./configureStore.dev')
}
