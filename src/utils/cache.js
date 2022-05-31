const nodeCache = require('node-cache')
const cache = new nodeCache({
    stdTTL: 10,
    checkperiod: 1 
})
module.exports = cache;