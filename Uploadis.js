const router = require('express').Router()
const cloudinary = require('cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
    secure: true
})

router.post('/upload',(req, res) => {
  
       try { 
        
       console.log("ips")
       // return res.json(console.log(file))
       } catch (error) {
            return res.json({success:false, message:error.message})
       }
    
})

module.exports = router