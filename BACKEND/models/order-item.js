const mongoose=require('mongoose')
//create models/collection of products
const orderItemSchema=mongoose.Schema({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
  
})

orderItemSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

orderItemSchema.set('toJSON',{
   virtuals:true
})

//node model for schema product
exports.OrderItem=mongoose.model('OrderItem',orderItemSchema)