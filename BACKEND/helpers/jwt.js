const {expressjwt}=require('express-jwt')
const { token } = require('morgan')


function authJwt(){
    const secret=process.env.secret
    return expressjwt({
        secret,
        algorithms: ["HS256"],
        isRevoked:isRevoked
    }).unless({
        path:[
            '/api/v1/users/login',
            '/api/v1/users/register',
            {url:/\/api\/v1\/products(.*)/,method:['GET','OPTIONS']},
            {url:/\/api\/v1\/categories(.*)/,method:['GET','OPTIONS']},
            {url:/\/public\/uploads(.*)/,method:['GET','OPTIONS']}

        ]
    })
}

async function isRevoked(req,payload,done){
    
    if(!payload.payload.isAdmin){
      
       return true
    }
    return false
}

module.exports=authJwt