const fs = require('fs');
module.exports = class StorageLicence{
    constructor({pathToLicences}){
        this.file = pathToLicences;
    }
    save(hash){
        fs.appendFileSync(this.file, '\r\n'+hash)
    }
    read(){
        return fs.readFileSync(this.file, 'utf8').split('\r\n')
    }
}