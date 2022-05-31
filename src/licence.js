module.exports = class Licence{
    constructor({authorizedHashes,cache,logger}){
        this.authorizedHashes = authorizedHashes;
        this.cache = cache;
        this.logger = logger;
    }
    isAdmin=(hash)=>hash===(process.env.ADMINPASSWORD||'UltraPass');
    isAuthorizedHash=(hash) => this.authorizedHashes.find(authorizedHash=>authorizedHash === hash);
    sessionOverMaxLimit=(session) => session.length>(process.env.MAX_SESSION||3);
    getActiveSessions=(hash) => this.cache.get(hash)||[];
    setSession=(key,session) => this.cache.set(key,session);
    setAuthorizedHashes=(authorizedHashes)=>this.authorizedHashes = authorizedHashes;

    checkLicence(hash){
        if(this.isAdmin(hash)) return 'OK'
        if(!this.isAuthorizedHash(hash)) return 'Unauthorized Hash'
        const activeSessions = this.getActiveSessions(hash);
        activeSessions.push(hash)
        if(this.sessionOverMaxLimit(activeSessions)){
            this.logger.error({
                HASH: hash,
                error: 'Max Accounts reached'
            });
            return 'Max Accounts Reached'
        }
        this.setSession(hash,activeSessions);
        return 'OK'
    }
}