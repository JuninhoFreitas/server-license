const { expect, should } = require('chai')

describe('Testing Licence', () => {
    describe('Constructor', () => {
        it('Should create an instance of Licence', () => {
            const Licence = require('../src/licence.js')
            const licence = new Licence({
                authorizedHashes: [],
                cache: {},
                logger: {}
            })
            expect(licence).to.be.an('object')
        })
    })
    describe('Methods', () => {
        context('isAdmin()', () => {
            it('Should return true if is admin', () => {
                const Licence = require('../src/licence.js')
                const licence = new Licence({
                    authorizedHashes: [],
                    cache: {},
                    logger: {}
                })
                expect(licence.isAdmin('UltraPass')).to.be.true
            })
        })
        context('isAuthorizedHash()', () => {
            it('Should return true if is authorized hash', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: {},
                    logger: {}
                })
                expect(licence.isAuthorizedHash(hash)).to.be.equal(hash)
            })
        });
        context('sessionOverMaxLimit()', () => {
            it('Should return false if session.length is under max_limit', () => {
                const Licence = require('../src/licence.js')
                const validSession = ['1', '1', '1']
                const licence = new Licence({
                    authorizedHashes: [],
                    cache: {},
                    logger: {}
                })
                expect(licence.sessionOverMaxLimit(validSession)).to.be.false
            })
            it('Should return true if session.length is over max_limit', () => {
                const Licence = require('../src/licence.js')
                const validSession = ['1', '1', '1', '1']
                const licence = new Licence({
                    authorizedHashes: [],
                    cache: {},
                    logger: {}
                })
                expect(licence.sessionOverMaxLimit(validSession)).to.be.true
            })
        });
        context('getActiveSessions()', () => {
            it('Should return an array', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: { get: (hash) => ['test'] },
                    logger: {}
                })
                expect(licence.getActiveSessions(hash)).to.be.an('array')
                expect(licence.getActiveSessions(hash)).to.be.deep.equal(['test'])
            })
            it('Should be an empty array', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: { get: () => undefined },
                    logger: {}
                })
                expect(licence.getActiveSessions(hash)).to.be.an('array')
                expect(licence.getActiveSessions(hash)).to.be.empty

            })
        })
        context('setSession()', () => {
            it('Should set a session', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const session = ['1', '1', '1']
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: { set: (key, session) => { } },
                    logger: {}
                })
                expect(licence.setSession(hash, session)).to.be.undefined
            })
        });
        context('setAuthorizedHashes()', () => {
            it('Should set authorized hashes', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [],
                    cache: {},
                    logger: {}
                })
                expect(licence.setAuthorizedHashes([hash])).to.be.deep.equal([hash])
                expect(licence.authorizedHashes).to.be.deep.equal([hash])
            })
        });
        context('checkLicence()', () => {
            it('Should return ok if hash is admin', () => {
                const Licence = require('../src/licence.js')
                const hash = 'UltraPass'
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: {},
                    logger: {}
                })
                expect(licence.checkLicence(hash)).to.be.equal('OK')
            })
            it('Should return Unauthorized Hash if isnt authorized', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [],
                    cache: {},
                    logger: {}
                })
                expect(licence.checkLicence(hash)).to.be.equal('Unauthorized Hash')
            })
            it('Should return Max Accounts Reached if session.length is over limit', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: { get: (hash) => ['1', '1', '1', '1'] },
                    logger: { error: () => { } }
                })
                expect(licence.checkLicence(hash)).to.be.equal('Max Accounts Reached')
            });
            it('Should return ok', () => {
                const Licence = require('../src/licence.js')
                const hash = 'validHash'
                const licence = new Licence({
                    authorizedHashes: [hash],
                    cache: {
                        get: () => ['1', '1'],
                        set: () => { }
                    },
                    logger: { error: () => { } }
                })
                expect(licence.checkLicence(hash)).to.be.equal('OK')
            })
        });

    })
})