const express = require("express")
require('dotenv').config()
const app = express()

app.get('/', (req,res)=>{
    res.send('hello World')
})
app.get('/jash', (req,res)=>{
    res.send('okok')
})

app.listen(process.env.PORT, ()=>{
    console.log(`example app listening on port ${port}`)
})