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
        
        //const {file} = req.files
        
        //console.log(req.files)
        const file = req.files.file
        //console.log(foto)
        //const {file} = req.files
        //console.log(file)
        
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({success: false, message: "no files were upload"})
        }

        if(file.size > 1024 * 1024 * 27) {
            return res.status(400).json({success: false, message: "size too large"})
        }

       
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            return res.status(400).json({success: false, message: "file format is incorrect"})
        }
        console.log("upload")
          // obligatorio añadir el try catch
                        try {
                            cloudinary.v2.uploader.upload(file.tempFilePath, {folder: 'DeutchFolder'}, async(err, result) => {
                                if(err) throw err;
                                // res.json("verification")
                                console.log(result)
                                let id = result.public_id
                                let url = result.url
                               // return res.json({id, url})
                               return res.json({message:'testons'})
                            })
                        } catch (error) {
                            return res.json({success:false, message:error.message})
                        }
       // return res.json(console.log(file))
       } catch (error) {
            return res.json({success:false, message:error.message})
       }
    
})

module.exports = router