const mongoose = require('mongoose')
const ImageSchema = mongoose.Schema({
    image:{type:Object},
    image1:{type:Object},
    image2:{type:Object},
    image3:{type:Object},
    image4:{type:Object},
    image5:{type:Object},
    image6:{type:Object},
})
module.exports = mongoose.model("ImageSchema", ImageSchema)
