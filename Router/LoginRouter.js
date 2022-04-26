
const express = require('express')
const LoginModel = require('../Model/LoginModel')
const appBoris = express.Router()
const CreerVoiture = require('../Model/CreerVoiture')
const AccessoireSchema = require('../Model/AccessoireSchema')
const ImageSchema = require('../Model/ImageSchema')
const tokenValidation = require('../midlewares/tokenValidation')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const cloudinary = require('cloudinary').v2
//const { default: axios } = require('axios')
const CreerPiece = require('../Model/CreerPiece')
const ImagePiece = require('../Model/ImageSchema')
const nodemailer = require("nodemailer");
//const MailModelSchema = require('../Model/MailModel')
const MailModelSchema = require('../Model/MainModel')
//translation
//const translate = require('translate')

const {TOKENENV,USERACOUNTMAIL,PASSWORDUSERACCOUNT,PASSWORDDEUTCH,} = process.env
const CREDENTIALS = JSON.stringify(process.env.CREDENTIALS)

//const configurationClient 

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
    secure: true
})

appBoris.post('/login', async(req, res)=>{
        try {
        const {nom, password} = req.body
        if(!nom){
            return res.json({success: false, message:'Verifier ce nom'})
        }

        if(!password){
            return res.json({success: false,message:'entrer votre mot de passe'})
        }

        let findByNom = await LoginModel.findOne({nom})

        if(!findByNom){
            return res.json({success:false, message: "Verifiez vos identifiants"})
        }

        if(!findByNom.nom){
            //console.log("bid")
            return res.json({success: false, message:"verifiez cotre nom"})
        }

        const myBcrypt = await bcrypt.compare(password, findByNom.password)
        
        if(myBcrypt == false){
            return res.json({success:false, message:'ce mot de passe n existe pas'})
          }else{
            let id
            const token = jwt.sign({id: findByNom._id}, TOKENENV, {expiresIn: "2h"})
            return res.json({success:true, findByNom, token, message:'existe'})
          }

    } catch (error) {
            return res.json({success:false, message: error.message})
    }
})

appBoris.post('/createUser', async(req, res)=>{
    try {
        let {nom, password} = req.body
        if(!nom){
            return res.json({success:false, message:"entrer votre nom"})
        }
        if(!password){
            return res.json({success:false, message:'entrer votre password'})
        }
        //let  {nom,password}= req.body
        const hashPassword = bcrypt.hashSync(password, salt)
        password = hashPassword
        let newLoginSchema = new LoginModel({nom,password})
        let newPost = await newLoginSchema.save()
        return res.json({success:true, newPost})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.post('/creerVoiture',tokenValidation,  async(req,res)=>{
  try {

    const {image,Marque,Model,Premiereimmatriculation,Kilometrage,Typedemoteur,Puissance,Indice,Typederapports,Typedevehicule,
        Nombredeportières,Couleurextérieure,Habitacle,Étatdelavoiture,Prix,PrixApproximatifAlaDouane,Description,Lieu} = req.body

   /* const {image,marque,typeVehicule,portières,habitacle,qualitéVoiture,etat,couleur,prix,prixApproximatif,
    description,lieuDuVehicule,typeEssence,typeManuel,chevaux,km,année} = req.body*/
    //if(Object.keys(image).length === 0 
    if(Object.keys(image).length === 0){
        return res.json({success:false, message:"entrer l image"})
    }
    if(!Marque){
        return res.json({success:false, message:"entrer la Marque"})
    }
    if(!Model){
        return res.json({success:false, message:"entrer la Model"})
    }
    if(!Premiereimmatriculation){
        return res.json({success:false, message:"entrer la Premièreimmatriculation"})
    }
    if(!Kilometrage){
        return res.json({success:false, message:"entrer le Kilométrage"})
    }
    if(!Typedemoteur){
        return res.json({success:false, message:"entrer le Typedemoteur"})
    }
    if(!Puissance){
        return res.json({success:false, message:"entrer la Puissance"})
    }
    if(!Indice){
        return res.json({success:false, message:"entrer l Indice"})
    }
    if(!Typederapports){
        return res.json({success:false, message:"entrer le Typederapports"})
    }
    if(!Typedevehicule){
        return res.json({success:false, message:"entrer le Typedevehicule"})
    }
    if(!Nombredeportières){
        return res.json({success:false, message:"entrer le Nombredeportières"})
    }
    if(!Couleurextérieure){
        return res.json({success:false, message:"entrer la couleur extérieure"})
    }
    if(!Habitacle){
        return res.json({success:false, message:"entrer l Habitacle"})
    }
    if(!Étatdelavoiture){
        return res.json({success:false, message:"entrer l Étatdelavoiture"})
    }
    if(!Prix){
        return res.json({success:false, message:"entrer le Prix"})
    }
    if(!PrixApproximatifAlaDouane){
        return res.json({success:false, message:"entrer le PrixApproximatifAlaDouane"})
    }
    if(!Description){
        return res.json({success:false, message:"entrer la Description"})
    }
    if(!Lieu){
        return res.json({success:false, message:"entrer le Lieu du véhicule"})
    }
    
    const creerVoiture = new CreerVoiture({image,Marque,Model,Premiereimmatriculation,Kilometrage,Typedemoteur,Puissance,
        Indice,Typederapports,Typedevehicule,Description,
        Nombredeportières,Couleurextérieure,Habitacle,Étatdelavoiture,Prix,PrixApproximatifAlaDouane,Lieu})

    const gardeVoiture = await creerVoiture.save()
    return res.json({success:true, gardeVoiture, message:'enregistrer avec succes'})

  } catch (error) {
    return res.json({success:false, message:error.message})
  }
})

appBoris.get('/recupereVoitureOccassion/:typeVehicule', async(req, res)=>{
   try {
     const {typeVehicule} = req.params
     if(!typeVehicule){
         return res.json({success:false, message:'verifier le type'})
     }

     if(typeVehicule == "occasion"){
         const getVoiture = await CreerVoiture.find({"Typedevehicule":typeVehicule})
         return res.json({success:true, getVoiture})
     }

   } catch (error) {
       return res.json({success: false, message:error.message})
   }
})

appBoris.get('/recupereVoitureLuxe/:Typedevehicule', async(req,res)=>{
    try {
        const {Typedevehicule} = req.params
        if(!Typedevehicule){
            return res.json({success:false, message:'verifier le type'})
        }
        //console.log(Typedevehicule)
        if(Typedevehicule == "luxe"){
            const getVoiture = await CreerVoiture.find({Typedevehicule})
            return res.json({success:true, getVoiture})
        }
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})


appBoris.get('/recupereVoitureTransport/:Typedevehicule', async(req,res)=>{
    try {
        const {Typedevehicule} = req.params
        if(!Typedevehicule){
            return res.json({success:false, message:'verifier le type'})
        }
       // console.log(Typedevehicule)
        if(Typedevehicule == "transport"){
            const getVoiture = await CreerVoiture.find({Typedevehicule})
            return res.json({success:true, getVoiture})
        }
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.get('/recuperePiece/:typeVehicule', async(req, res)=> {
    try {
        const {typeVehicule} = req.params
        if(!typeVehicule){
            return res.json({success:false, message:'verifier le type'})
        }
   
        if(typeVehicule == "piece"){
            const getVoiture = await CreerVoiture.find({typeVehicule})
            return res.json({success:true, getVoiture})
        }
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})
 // a revoir
/*appBoris.get('/rechercherParKilometre/:kilometre', async(req, res)=> {
    try {
        const {kilometre}= req.params
        if(!kilometre){
            return res.json({success:false, message:"le kilometrage n a pas ete mis"})
        }
        const rechercheKilometrage = await LoginModel.find({kilometre})
        return res.json({success:true, rechercheKilometrage})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})*/

/*appBoris.get('/rechercheAutre/:autre', async(req,res)=> {
    try {
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})*/

/*appBoris.get('/rechercheAutre/:autre', async(req,res)=> {
    try {
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})*/

appBoris.put('/ModifierVoiture/:id', async(req,res)=> {
    try {
       const {id} = req.params
       // le model doit etre different
       const verifiedId = await LoginModel.findById(id) 
       if(!verifiedId){
           return res.json({success:false, message:'cette voiture n existe pas'})
       }
      // const modifier = await LoginModel.findByIdAndUpdate()
      return res.json({success:true, message:'effectue avec succes'})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.delete('/supprimerVoiture/:id', async(req,res)=> {
    try {
        const {id} = req.params
        if(!id){
            return res.json({success:false, message:"cet element n existe plus"})
        }
        const elementASupprimer = await LoginModel.findByIdAndDelete(id)
        return res.json({success: true, elementASupprimer})

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

/*appBoris.get('/test', async(req, res)=>{
 //console.log('test')
})*/

appBoris.post('/UploadImage', async(req,res)=>{
    const {file}= req.files
    //console.log(file)
    cloudinary.uploader.upload(file.tempFilePath,{folder: 'DeutchFolder'}, function(error,result){
        //console.log('error', error)
        //console.log('result', result)
        let id = result. public_id
        let url = result.url
        let secure_url = result.secure_url
        let objetGenerale = {id, url}
        res.json({success:true, objetGenerale})
    })
   /* cloudinary.uploader.upload(file.tempFilePath, {folder: 'DeutchFolder'}, async(req,res)=>{
         res.json({success:true, res})
    })*/
})

appBoris.get('/RecupereVoitureDoccasion/:id', async(req,res)=>{
   try {
    const {id}= req.params
    if(!id){
        return res.json({success:false, message:'verifier votre id'})
    }
    const rechercheId = await CreerVoiture.findById(id)
    return res.json({success:true, rechercheId})
   } catch (error) {
     return res.json({success:false, message:error.message})  
   }
})

appBoris.get('/RecupereVoitureMemeMarque/:marque', async(req,res)=>{
    try {
        const {marque}= req.params
        if(!marque){
            return res.json({success: false, message:"vérifier la marque du vehicule"})
        }
        const recupereVoitureMarque = await CreerVoiture.find({marque})
        return res.json({success:true, recupereVoitureMarque})
    } catch (error) {
        return res.json({success:false, message:error.message})   
    }
})

appBoris.get('/RecupereIdEtMarque/:id/:marques', async(req,res)=>{
    try {
        const {id,marques}= req.params
        let marque2
        if(!id){
             return res.json({success: false, message:"vérifier votre id"})
        }
        if(!marques){
             return res.json({success: false, message:"vérifier votre votre marque"})
        }

        const recupereVoitureId = await CreerVoiture.findById(id)

        if(recupereVoitureId){
            marque2= recupereVoitureId.marque
           // console.log(marque2)
        }
        const recupereVoitureMarque = await CreerVoiture.find({"marque": marque2})
        
        return res.json({succes: true, recupereVoitureId,  recupereVoitureMarque})
    } catch (error) {
        return res.json({success:false, message:error.message}) 
    }
})

appBoris.post('/sendTest',tokenValidation, async(req,res)=>{
    try {
        const {image:{id,url},marque,typeVehicule,portières,habitacle,qualitéVoiture,etat,couleur,prix,prixApproximatif,description,lieuDuVehicule} = req.body
        const creerVoiture = new CreerVoiture({image:{id,url},marque,typeVehicule,portières,habitacle,qualitéVoiture,etat,couleur,prix,prixApproximatif,description,lieuDuVehicule})
        const creer = await creerVoiture.save()
        return res.json({succes:true, creer, message:"enregistrer avec succes"})
    } catch (error) {
        return res.json({succes:false, message:error.message})
    }
})

appBoris.get('/recupereTouteVoiture',tokenValidation, async(req,res)=>{
    try {
        const recupereVoiture = await CreerVoiture.find()
       // console.log(recupereVoiture)
        return res.json({succes:true, recupereVoiture})
    } catch (error) {
        return res.json({succes:false, message:error.message})
    }
})

appBoris.delete('/deleteVoiture/:id',tokenValidation, async(req,res)=>{
try {
    const {id} = req.params
    const eliminerVoiture = await CreerVoiture.findByIdAndDelete(id)
    return res.json({success:true, eliminerVoiture, message:'eliminé avec succès'})
} catch (error) {
    return res.json({success:false, message:error.message})
}
})

appBoris.put('/effectuerModification/:id', tokenValidation, async(req,res)=>{
    try {
        const {id} = req.params
        /*const {marque,typeVehicule,portières,habitacle,qualitéVoiture,etat,couleur,
        prix,prixApproximatif,description,lieuDuVehicule} = req.body*/
     
        const {Marque,Model,Premiereimmatriculation,Kilometrage,Typedemoteur,Puissance,Indice,Typederapports,Typedevehicule,
        Nombredeportières,Couleurextérieure,Habitacle,Étatdelavoiture,Prix,PrixApproximatifAlaDouane,Description,Lieu,EtatdeVente} = req.body
    
       const rechercheNotreObjet = await CreerVoiture.findById(id)
       if(rechercheNotreObjet._id){
            const modifierLaVoiture = await CreerVoiture.findByIdAndUpdate(id,{Marque,Model,Premiereimmatriculation,Kilometrage,Typedemoteur,Puissance,Indice,Typederapports,Typedevehicule,
            Nombredeportières,Couleurextérieure,Habitacle,Étatdelavoiture,Prix,PrixApproximatifAlaDouane,Description,Lieu,EtatdeVente},{new:true})
           return res.json({succes:true, modifierLaVoiture, message:"Effectuer avec succès"})
       }     

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.post('/AjouterAccessoire/:id', tokenValidation, async(req,res)=>{
    try {
        
        const {id} = req.params
        const {Airconditionné,Aideaustationnement,Bluetooth,ABS,Radio,Kitmainlibre,Visitetechnique,jantes,Tempomat,
            Toitouvrantpanorama,SystèmedeNavigation,Siègeschauffant,Siègesmassants,PharesXénon} = req.body

        const rechercherIdVoiture = await CreerVoiture.findById(id)
        //console.log(rechercherIdVoiture._id)
        if(rechercherIdVoiture._id){
            console.log("modifier une voiture")
              // si rechercheIdVoiture.AccessoireVoiture!= 0 alors on creer l Accessoire et on modifie la voiture principale         
           //   console.log(rechercherIdVoiture.AccessoireSchema.length)
                    if(rechercherIdVoiture.AccessoireSchema.length == 0){
                       // console.log("on cree l accessoire et on modifie la voiture")
                        const creerAccessoire = new AccessoireSchema({Airconditionné,Aideaustationnement,Bluetooth,ABS,Radio,Kitmainlibre,Visitetechnique,jantes,Tempomat,
                        Toitouvrantpanorama,SystèmedeNavigation,Siègeschauffant,Siègesmassants,PharesXénon})
                        const nouvelAccessoire = await creerAccessoire.save()  
                        idDeLAccessoire = nouvelAccessoire._id
                        const updateVoiture = await CreerVoiture.findByIdAndUpdate(id,{$push:{AccessoireSchema : nouvelAccessoire._id}}, {new:true})
                        //console.log(updateVoiture)
                        return res.json({succes:true, updateVoiture, message:"bien joué"})
                    }else{
                        //console.log("on modifie l accessoire de la voiture"+rechercherIdVoiture.AccessoireSchema)
                        //console.log(Bluetooth)
                        const modifierAccessoire = await AccessoireSchema.findByIdAndUpdate(rechercherIdVoiture.AccessoireSchema,{
                            Airconditionné,Aideaustationnement,Bluetooth,ABS,Radio,Kitmainlibre,Visitetechnique,jantes,Tempomat,
                            Toitouvrantpanorama,SystèmedeNavigation,Siègeschauffant,Siègesmassants,PharesXénon
                        }, {new:true})
                        //console.log(modifierAccessoire)
                        return res.json({success:true, modifierAccessoire, message:"Modification éffectuée avec succès"})
                    }
              // else{on cree simplement l accessoir}
        }else{
           // console.log("creer une voiture")
        }
      
       
        //return res.json({success:true, updateVoiture}) 
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.post('/AjouterImageAVoiture/:id', tokenValidation, async(req,res)=>{
    try {
        const {id}= req.params
        const {image, image1,image2,image3,image4,image5,image6} = req.body

        /*if(Object.keys(image).length === 0 || Object.keys(image1).length === 0 || Object.keys(image2).length || 
        Object.keys(image3 || Object.keys(image4).length).length || Object.keys(image5).length || Object.keys(image6).length){
            console.log("affiche une erreur")
            res.json({success:false, message:"entrer toutes vos images et "})
        }*/

        if(Object.keys(image).length === 0){
            res.json({success:false, message:"entrer l image 0"})
        }
        if(Object.keys(image1).length === 0){
            res.json({success:false, message:"entrer l image 1"})
        }
        if(Object.keys(image2).length === 0){
            res.json({success:false, message:"entrer l image 2"})
        }
        if(Object.keys(image3).length === 0){
            res.json({success:false, message:"entrer l image 3"})
        }
        if(Object.keys(image4).length === 0){
            res.json({success:false, message:"entrer l image 4"})
        }
        if(Object.keys(image5).length === 0){
            res.json({success:false, message:"entrer l image 5"})
        }
        if(Object.keys(image6).length === 0){
            res.json({success:false, message:"entrer l image 6"})
        }

        
        const CreerNewImageVoiture = new ImageSchema({image, image1,image2,image3,image4,image5,image6})
       
        const EnregistrementImage = await CreerNewImageVoiture.save()
       // console.log(EnregistrementImage._id)

       //on verifie sil quelque chose dans la bdd
      /* const verifionslIdentifiant = await CreerVoiture.findById(id)
       if(verifionslIdentifiant.ImageAutre.length > 0){
            return res.json({success:false, messsage:"vous avez deja entré des image"})
       }*/

        const addImageToVoiture = await CreerVoiture.findByIdAndUpdate(id,{$push:{ImageAutre: EnregistrementImage._id}},{new:true})
      
         //console.log(addImageToVoiture.ImageAutre)

        /* if(addImageToVoiture.ImageAutre.length >= 2){
             return res.json({succes: false, message:" déja ajouté"})
         }*/

        return res.json({success:true, addImageToVoiture , message:"effectuer good"})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.get('/RechercherIdImage/:id', async(req,res)=> {
    try {
    const {id}= req.params
    const recupereImage = await ImageSchema.findOne({_id:id})
    return res.json({success: true, recupereImage})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.get('/rechercheVoiture/:id', async(req,res)=> {
    try {
    const {id}= req.params
    const maVoiture = await CreerVoiture.findById(id)
    return res.json({success: true, maVoiture})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.get('/recupVoitureEtMarqueAssocie/:id/:Marque', async(req,res)=> {
    try {
    const {Marque,id}= req.params
    const maVoitureId = await CreerVoiture.findById(id)
    //console.log(maVoitureId.ImageAutre[0])

    const maVoitureMarques = await CreerVoiture.find({"Marque":Marque})

    const maVoitureMarque = await CreerVoiture.findById(id)
    const envoyerlimage = await ImageSchema.findById(maVoitureId.ImageAutre[0])
   
    let idAccessoire = maVoitureId.AccessoireSchema[0]
   // console.log(idAccessoire)

    const recupereAccessoire = await AccessoireSchema.findById(idAccessoire)
    //console.log(recupereAccessoire)
    if(!Marque){
        return res.json({success:false, message:"n existe pas"})
    }

    if(recupereAccessoire === null || envoyerlimage === null){
        return res.json({success: false, message:"veuillez Contacter l'administrateur pour qu'il complète les données"})
    }
    //console.log(recupereAccessoire)
    return res.json({success: true, maVoitureId,maVoitureMarque,envoyerlimage,recupereAccessoire, maVoitureMarques})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

appBoris.get('/rechercheEnfonctionDeLaMarque/:Marque', async(req,res)=>{
    try {
        const {Marque} = req.params
        //console.log(Marque)
        const recupèreMarques = await CreerVoiture.find({Marque})

      //  console.log(recupèreMarques)

        if(recupèreMarques.length === 0){
           // console.log("ici")
            return res.json({success:false, message:"cette marque n existe pas"})
        }
        
        if(recupèreMarques){
            return res.json({succes: true, recupèreMarques})
        }
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.get("/rechercheMarqueEtModel/:Marque/:Model", async(req,res)=>{
    try {
       const {Marque,Model} = req.params
       const rechercheMarqueModel = await CreerVoiture.find({Marque,Model}) 

       if(!Marque || ! Model){
           return res.json({success:false, message:"ce dernier n existe pas"})
       }
     // console.log(rechercheMarqueModel)
       if(rechercheMarqueModel.length === 0){
           return res.json({succes:false, message:"nous ne trouvons pas ce modèl"})
       }
       return res.json({succes: true, rechercheMarqueModel})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.get("/recupereModificationId/:id", tokenValidation, async(req,res)=>{
    try {
       const {id} = req.params

      if(!id){
        return res.json({success:false, message:"vérifier que l identifiant a été entré"})
      }else{
          const recuperVoitureId = await CreerVoiture.findById(id)
          return res.json({success:true, recuperVoitureId})
      }
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.get("/recupereAccessoireId/:id", tokenValidation, async(req,res)=>{
    try {
       const {id} = req.params

      if(!id){
        return res.json({success:false, message:"vérifier que l identifiant a été entré"})
      }

      const PrendreIdVoiture = await CreerVoiture.findById(id)

     /* if(!PrendreIdVoiture.AccessoireSchema || PrendreIdVoiture.AccessoireSchema == null){
         return res.json({success:false, message:"n existe pas"})
      }*/
     // console.log(PrendreIdVoiture.AccessoireSchema)

      const RecupereIdSchema = await AccessoireSchema.findById(PrendreIdVoiture.AccessoireSchema)
      //console.log(RecupereIdSchema)
      return res.json({success:true, RecupereIdSchema})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.post('/CreerPiece', tokenValidation, async(req,res)=>{
    try {
        const {image,nomDeLaPiece,etatDelePiece} = req.body
        if(Object.keys(image).length === 0){
            return res.json({success:false, message:"Entrer l image"})
        }
        //console.log(nomDeLaPiece)
        //console.log(etatDelePiece)
        if(!nomDeLaPiece){
            return res.json({success:false, message:"Entrer le nom de la pièce et autre"})
        }
        if(!etatDelePiece){
            return res.json({success:false, message:"l'état de la pièce est obligatoire"})
        }
        const CreerPieceAjouter = new CreerPiece({image,nomDeLaPiece,etatDelePiece})
        const RetourPiece = await CreerPieceAjouter.save()
        return res.json({success: true, RetourPiece})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.delete('/SupprimerPiece/:id', tokenValidation, async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            res.json({success:false, message:"Vérifier votre identifiant"})
        }
        const PieceASupprimer = await CreerPiece.findByIdAndDelete(id)
        return res.json({success:true,PieceASupprimer})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.put('/AjouterAccessoireAPiece/:idPiece', tokenValidation, async(req,res)=>{
    try {
        const {idPiece} = req.params
        const {image1,image2,image3,image4,image5} = req.body

       // console.log(idPiece)
       const maPiece = await CreerPiece.findById(idPiece)
       //console.log(maPiece)
        if(!idPiece){
            return res.json({success:false, message:"nous ne reconnaissons pas cette voiture"})
        }
        if(Object.keys(image1).length === 0){
            return res.json({success:false, message:"la primiere image est obligatoire"})
        }
        if(Object.keys(image2).length === 0){
            return res.json({success:false, message:"la deuxieme image est obligatoire"})
        }
        if(Object.keys(image3).length === 0){
            return res.json({success:false, message:"la troisieme image est obligatoire"})
        }
        if(Object.keys(image4).length === 0){
            return res.json({success:false, message:"la quatrième image est obligatoire"})
        }
        if(Object.keys(image5).length === 0){
            return res.json({success:false, message:"la cinquième image est obligatoire"})
        }

        const CreerImage = new ImagePiece({image1,image2,image3,image4,image5})
        const NouvelleImageCreer = await CreerImage.save()

        console.log(NouvelleImageCreer._id)
        const verifierleChampArray = await CreerPiece.findById(idPiece)
        //console.log(verifierleChampArray.idAutreImagePiece.length)
         let nbreOccurence = verifierleChampArray.idAutreImagePiece.length
        if(nbreOccurence === 1){
            return res.json({success:false, message:"Vous avez déja entré des images ici"})
        }

        let idImage = NouvelleImageCreer._id
       // console.log(idImage)
       // const updateVoiture = await CreerVoiture.findByIdAndUpdate(id,{$push:{AccessoireSchema : nouvelAccessoire._id}}, {new:true})
        const ModifierlaPieceEnAjoutantImage = await CreerPiece.findByIdAndUpdate(idPiece,{$push:{idAutreImagePiece : NouvelleImageCreer._id}}, {new : true})
        
        return res.json({success:true, message:"fait avec succès", ModifierlaPieceEnAjoutantImage})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.get('/recupereToutePiece', async(req,res)=>{
    try {
        const recupereToutePiece = await CreerPiece.find()
        return res.json({succes:true, recupereToutePiece})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.get('/recherchePiece/:nomDeLaPiece', async(req,res)=>{
    try {
        const {nomDeLaPiece} = req.params
        const RechercherNomPieceDansLaBd = await CreerPiece.find({nomDeLaPiece})

        if(nomDeLaPiece === undefined){
            return res.json({success:false, message:"entrer la Pièce a rechercher"})
        }
        if(!RechercherNomPieceDansLaBd){
            return res.json({success:false, message:"cette piece n'est pas encor disponible"})
        }
        return res.json({success:true, RechercherNomPieceDansLaBd})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.get('/RecupereIdPiece/:id', async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            return res.json({success:false, message:"entrer votre message"})
        }
        const maPiece = await CreerPiece.findById(id)
        const rechercheLesIdAppropriés = await ImagePiece.findById(maPiece.idAutreImagePiece)
        return res.json({success:true, maPiece, rechercheLesIdAppropriés})
    } catch (error) {
        res.json({succes:false, message:error.message})
    }
})

appBoris.post('/sendMail/:id', async(req,res)=>{
    try {
        const {email,messages} = req.body
        const {id} = req.params

        const rechercherId = await CreerVoiture.findById(id);
        let Marque = rechercherId.Marque
        let Model = rechercherId.Model
        let Prix = rechercherId.Prix
        let Puissance = rechercherId.Puissance

      //  console.log(rechercherId)
        //seoaration
        //let testAccount = await nodemailer.createTestAccount();

        const sendMail = new MailModelSchema({email,messages})
       // console.log(sendMail.email)
        let monMail = sendMail.email
        let monTel = sendMail.telephone
        let monText = sendMail.messages.leMessage

  // create reusable transporter object using the default SMTP transport

    /*const output = `<span>Message: ${req.body.messages}</span> 
                    <span> Numero de telephone: ${req.body.messages.telephone}</span><br/>
                    <span> Nom du pays: ${req.body.messages.pays}</span>`*/

                    const output = `<span>Message: ${req.body.messages}</span><br/>
                                    <span>Marque: ${Marque}</span><br/>
                                    <span>Model: ${Model}</span><br/>
                                    <span>Prix: ${Prix}</span><br/>
                                    <span>Puissance: ${Puissance}</span>`
 
 
  let transporter = nodemailer.createTransport({
    //host: "mail.gmail.com",
    //port: 587,
    //secure: false, // true for 465, false for other ports
   service:'gmail',
    auth: {
      user: USERACOUNTMAIL, // generated ethereal user
      pass: PASSWORDDEUTCH, // generated ethereal password
    },
  });

  var message = {
    from: monMail, // sender address
    to: USERACOUNTMAIL, // list of receivers
    subject: monMail, // Subject line
    text: "monText", // plain text body
    html:output
   // azpkiymdzkqfvozt
  }

  transporter.sendMail(message,(err,info)=>{
    if(err){
        //console.log("error in sending mail")
        return res.json({succes:false, message:"ce mail n est pas envoyé"})
    }else{
      //  console.log("succes", info)
        return res.json({succes:true,sendMail, message:"envoyé de succes"})
    }
  })

    } catch (error) {
        res.json({succes: false, message: error.message})
        return res.json({succes:true, message:"mail envoyé"})
    }
})

appBoris.post("/rechercheQuatre", async(req,res)=>{
   try {
    const {Marque,Model,Prix,Puissance} = req.body
    if(!Marque){
        return res.json({success:false, message:"verifier Votre Marque"})
    }
    if(!Model){
        return res.json({success:false, message:"verifier Votre Model"})
    }
    if(!Prix){
        return res.json({success:false, message:"verifier Votre Prix"})
    }
    if(!Puissance){
        return res.json({success:false, message:"verifier Votre Puissance"})
    }

    const AfficherMarque = await CreerVoiture.find({Marque,Model,Prix,Puissance})

    if(!AfficherMarque){
        return res.json({success:false, message:"cette voiture n' existe pas"})
    }
    if(AfficherMarque.length === 0){
        return res.json({success:false, message:"cette voiture n' existe pas"})
    }
    return res.json({success:true, AfficherMarque})
   } catch (error) {
    res.json({succes: false, message: error.message})
   }
})


  appBoris.post('/sendMailPiece/:id', async(req,res)=>{
    try {
        let {email,messages} = req.body
        const {id} = req.params

        const maPieceRecherche = await CreerPiece.findById(id);
         nomDeLaPiece = maPieceRecherche.nomDeLaPiece
         etatDelePiece = maPieceRecherche.etatDelePiece

        

        const sendMail = new MailModelSchema({email,messages})
       // console.log(sendMail.email)
        let monMail = sendMail.email

        const output = `<span>Message: ${messages}</span><br/>
                                   <span>email: ${email}</span><br/>
                                    <span>nomDeLaPiece: ${nomDeLaPiece}</span><br/>
                                    <span>etatDelePiece: ${etatDelePiece}</span><br/>`
                                
        //console.log(maPieceRecherche)
       // console.log(email, messages)

        let transporter = nodemailer.createTransport({
           service:'gmail',
            auth: {
              user: USERACOUNTMAIL, // generated ethereal user
              pass: PASSWORDDEUTCH, // generated ethereal password
            },
          });
        
          var message = {
            from: monMail, // sender address
            to: USERACOUNTMAIL, // list of receivers
            subject: monMail, // Subject line
            text: "monText", // plain text body
            html:output
          }
          transporter.sendMail(message,(err,info)=>{
            if(err){
                //console.log("error in sending mail")
                return res.json({succes:false, message:"ce mail n est pas envoyé"})
            }else{
                //console.log("succes", info)
                return res.json({succes:true,sendMail, message:"Success"})
            }
          })
        
            } catch (error) {
                res.json({succes: false, message: error.message})
                return res.json({succes:true, message:"mail envoyé"})
            }
})

  



module.exports = appBoris