const cache = require('../utils/cache');
const Licence = require('../licence');
const logger = require('../utils/logger');
const StorageLicence = require('../storage');
const pathToLicences = './licenses.txt';
const storageLicence = new StorageLicence({pathToLicences})

const authorizedHashes = storageLicence.read();
const licence = new Licence({authorizedHashes,cache,logger});
module.exports = {
    checkLicence: (req,res)=>{
        const hash = req.query.hash;
        const result = licence.checkLicence(hash);
        return res.send(result)
    },
    register: (req, res) => {
        const hash = req.query.hash;
        storageLicence.save(hash);
        licence.setAuthorizedHashes = storageLicence.read();
        return res.send('License registered')
    },
}