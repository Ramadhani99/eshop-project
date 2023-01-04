const mongoose=require('mongoose')
//create models/collection of products
const orderSchema=mongoose.Schema({
    name:String,
    image:String,
    countInStock:{
        type:Number,
        required:true
    }
})

orderSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

orderSchema.set('toJSON',{
   virtuals:true
})

//node model for schema product
exports.Order=mongoose.model('Order',orderSchema)