const mongoose = require('mongoose')

const ImagePiece = mongoose.Schema({
    image1:{type:Object},
    image2:{type:Object},
    image3:{type:Object},
    image4:{type:Object},
    image5:{type:Object},
})

module.exports = mongoose.model('ImagePiece',ImagePiece)