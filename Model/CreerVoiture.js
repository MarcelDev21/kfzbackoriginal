const mongoose = require('mongoose')

const CreerVoiture = mongoose.Schema({
    /*image:{type:Object},
    marque:{type:String,lowercase: true},
    type:{type:String,lowercase: true},
    model:{type:String},
    immatriculation:{type:String},
    moteur:{type:String},
    puissance:{type:String},
    indice:{type:String},
    rapports:{type:String},
    typeVehicule:{type:String},
    portières:{type:Number},
    couleur:{type:String},
    habitacle:{type:String},
    etat:{type:String},
    prix:{type:Number},
    prixApproximatif:{type:Number},
    qualitéVoiture:{type:String},
    description:{type:String},
    lieuDuVehicule:{type:String},
    typeEssence:{type:String},
    typeManuel:{type:String},
    chevaux:{type:Number},
    km:{type:Number},
    année:{type:Number},*/

    image:{type:Object,lowercase: true,},
    Marque:{type:String,lowercase:true},
    Model:{type:String, required:true, lowercase: true,},
    Premiereimmatriculation: {type:String, lowercase: true,},
    Kilometrage: {type:Number,lowercase: true,},
    Typedemoteur:{type:String, lowercase: true,} ,
    Puissance:{type:Number, lowercase: true,}, 
    Indice:{type:Number, lowercase: true,},
    Typederapports:{type:String, lowercase: true,},
    Typedevehicule:{type:String, lowercase: true,}, 
    Nombredeportières:{type:String,lowercase: true,}, 
    Couleurextérieure:{type:String, lowercase: true,},
    Habitacle:{type:String, lowercase: true,},
    Étatdelavoiture:{type:String, lowercase: true,},
    Prix:{type:String, lowercase: true,}, 
    PrixApproximatifAlaDouane:{type:Number, lowercase: true,},
    Description:{type:String, lowercase: true,},
    Lieu:{type:String, lowercase: true,},
    EtatdeVente:{type:String, lowercase: true,},
    AccessoireSchema:[{type:mongoose.Types.ObjectId, ref:"AccessoireSchema"}],
    ImageAutre:[{type:mongoose.Types.ObjectId, ref:"ImageSchema"}],
    AutreImage:[{type:mongoose.Types.ObjectId, ref:"ImageSchema"}]
})



module.exports = mongoose.model('CreerVoiture',CreerVoiture)