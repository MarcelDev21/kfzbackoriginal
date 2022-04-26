
const mongoose = require('mongoose')

const CreerPiece = mongoose.Schema({
    image:{type:Object},
    nomDeLaPiece:{type:String,lowercase: true},
    etatDelePiece:{type:String,lowercase: true},
    idAutreImagePiece:[{type:mongoose.Types.ObjectId, ref:"ImagePiece"}]
   // AutreImage:[{type:mongoose.Types.ObjectId, ref:"ImageSchema"}]
})

module.exports = mongoose.model('CreerPiece',CreerPiece)
