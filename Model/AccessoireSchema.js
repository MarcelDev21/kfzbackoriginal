const mongoose = require('mongoose')
const AccessoireSchema = mongoose.Schema({
// climatisation:{type:String},
Airconditionné:{type:String},
Aideaustationnement:{type:String},
Bluetooth :{type:String},
ABS:{type:String}, 
Radio:{type:String},
Kitmainlibre:{type:String}, 
Visitetechnique:{type:String},
jantes:{type:String}, 
Tempomat:{type:String}, 
Toitouvrantpanorama:{type:String}, 
SystèmedeNavigation:{type:String}, 
Siègeschauffant:{type:String}, 
Siègesmassants:{type:String}, 
PharesXénon:{type:String},
})
module.exports = mongoose.model("AccessoireSchema", AccessoireSchema)