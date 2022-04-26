const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUplaod = require('express-fileupload')
const uploadImage = require('./Uploadis')

const bcrypt = require("bcrypt");
require('dotenv').config()

const appBoris = require('./Router/LoginRouter')
/*const appBoris = require('./Routers/LoginRouter');
const uploadImage = require('./uploads')*/

const app = express()
const {PORT,DB} = process.env


mongoose.connect((DB))
.then(() => console.log("connected succesfuly to Bd"))
.catch((error) => console.log(error))

//mongoose.connect((DB)).then(() => console.log("succesfull"))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUplaod({useTempFiles: true}))
app.use(cors())



app.use('/', appBoris)
app.use('/upload', uploadImage)
/*app.use(cors())
app.use('/login', appBoris)
app.use('/upload', uploadImage)*/

const salt = bcrypt.genSaltSync(10);
console.log(`Bcrypt funciona. MIRA!!!: ${bcrypt.hashSync("1234", salt)}`);

app.listen(PORT, () => { console.log("connecté au port"+ PORT)})