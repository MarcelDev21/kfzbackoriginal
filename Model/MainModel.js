const mongoose = require('mongoose')

 const SchemaMail = mongoose.Schema({
    email:{type:String,trim:true,unique:true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    messages:{type:Object}
})

//module.exports=('SchemaMail', SchemaMail)
module.exports = mongoose.model("SchemaMail", SchemaMail)