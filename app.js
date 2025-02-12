const express = require('express')
const app = express()
const port = 8005
const db = require('./config/db')

app.use(express.urlencoded())



app.use('/api',require('./routes/api/v1/adminRoutes'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))