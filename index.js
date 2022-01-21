const express = require('express')
const nodeCache = require('node-cache')
const winston = require('winston');
const fs = require('fs');
const { Console } = require('console');
const app = express()
app.set('trust proxy', true)
const cache = new nodeCache({
    stdTTL: 1,
    checkperiod: 1
})
const port = 7777;
const max_session = 3;
let i = 1;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'user-service'
    },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        }),
    ],
});

//Chama endpoint
//Pega o HASH
//Verifica se já tem sessão logada
//Se tiver mais que três, derruba a sessão
//Se não tiver, cria uma sessão
let authorizedHashes = fs.readFileSync('./licenses.txt', 'utf8').split('\r\n');

console.log(authorizedHashes)
setInterval(() => {
    authorizedHashes = fs.readFileSync('./licenses.txt', 'utf8').split('\r\n');
}, 500);
app.get('/license', (req, res, next) => {
    const HASH = req.query.hash;
    if (HASH != 'HASHDEADM') {
        let sessions = cache.get(HASH);
        if (sessions) console.log(sessions.length)

        if (!sessions) {
            if (authorizedHashes.find(hash => hash === HASH)) {
                sessions = [HASH];
                cache.set(HASH, sessions);
                cache.set(`${HASH}-time`, Date.now())
                return res.send('OK')
            }else{
                return res.send('INVALID')
            }
        }
        if (sessions.length <= max_session) {
            if (authorizedHashes.find(hash => hash === HASH)) {
                sessions.push(HASH);
                // console.log(cache.get(`${HASH}-time`))
                cache.set(HASH, sessions);
                return res.send('OK')
            }
            else{
                return res.send('INVALID')
            }
        } else {
            let info = {
                HASH: HASH,
                time: (new Date(Date.now())).toString(),
                error: 'Max Accounts reached'
            }
            logger.error(info);
            return res.send('ERROR')
        }
    } else {
        return res.send('OK')
    }
})

app.get('/newlicense',(req,res,next)=>{
    const HASH = req.query.hash;
    let licenses = fs.readFileSync('./licenses.txt', 'utf8')
    fs.appendFileSync('./licenses.txt', '\r\n'+HASH)
    return res.send('License registered')
})


app.listen(port, () => {
    console.log(`rodando aqui: http://localhost:${port}/license`)
})