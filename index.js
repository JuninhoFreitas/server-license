require('dotenv-safe').config()
const express = require('express')
const routes = require('./src/http/routes');
const app = express()
const port = process.env.PORT||7777;
app.use(routes);
app.listen(port, () => {
    console.log(`rodando aqui: http://localhost:${port}/license`)
})