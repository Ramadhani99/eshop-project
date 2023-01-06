const express=require('express')
const app=express()
const mongoose=require('mongoose')
//get enviroment variable
require('dotenv/config')
//log events
const morgan=require('morgan')

//protect server
const authJwt=require('./helpers/jwt')

//products
const productsRouter=require('./routers/product')
const usersRouter=require('./routers/user')
const orderRouter=require('./routers/order')
const categoryRouter=require('./routers/category')
const res = require('express/lib/response')
const errorHandler=require('./helpers/error-handle')

//json middleware
app.use(express.json())
//log request
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))

//log api
const connection=process.env.CONNECTION_STRING
const api=process.env.API_URL

//Router
app.use(`${api}/products`,productsRouter)
app.use(`${api}/categories`,categoryRouter)
app.use(`${api}/users`,usersRouter)
app.use(`${api}/orders`,orderRouter)


//connect to mongoose
mongoose.connect(connection,
    {useNewUrlParser: true,
    useUnifiedTopology: true}

    ).then(
    ()=>{
        console.log('database connected...........')
    }
).catch( (err)=>{
    console.log('>>>>>>>>>>>>>>>>>>>')
    console.log(err)
} )

app.listen(9999,()=>{
    console.log(api)
    console.log('the server is started now')
})