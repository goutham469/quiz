const express = require("express")
const app = express()
const CORS = require('cors')
const userRouter = require("./routes/user.route")
require('dotenv').config()

app.use(CORS())
app.use(express.json())


app.get('/', (req,res)=>{
    res.send("Quiz server")
})

app.use('/user', userRouter )

const { PORT } = process.env;
app.listen( PORT, ()=> console.log(`server running ON PORT ${PORT}`) );

