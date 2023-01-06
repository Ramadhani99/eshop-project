const mongoose=require('mongoose')
//create models/collection of products
const orderSchema=mongoose.Schema({
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OrderItem',
        required:true
    }],
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    totalPrice:{
        type:Number,
        required:true
    },
    dateOrdered:{
        type:Date,
        required:true,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
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