
const jwt = require('jsonwebtoken')
//const { use } = require('../routers/AuthorsRouter')
const {TOKENENV}= process.env
let tokenValidation = (req,res,next) => {
    let token = req.headers.token

    if(!token){
        return res.json({success:false, message:'este token no existe'})
    }
    jwt.verify(token, TOKENENV,(error,user)=>{
        if(error){
            return res.json({success:false, message:'token valid'})
        }else{
            //console.log(decoded.id)
            //console.log(user)
            req.user = user
            next()
        }
    })
}
module.exports = tokenValidation