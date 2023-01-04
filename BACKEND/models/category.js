const mongoose=require('mongoose')
//create models/collection of products
const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:{
        type:String,
    },
    color:{
        type:String
    }
})

categorySchema.virtual('id').get(function(){
    return this._id.toHexString()
})

categorySchema.set('toJSON',{
   virtuals:true
})

//node model for schema product
exports.Category=mongoose.model('Category',categorySchema)