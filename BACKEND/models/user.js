const mongoose=require('mongoose')
//create models/collection of products
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    country:{
        type:String,
        default:''
    },
    street:{
        type:String,
        default:''
    },
    apartment:{
        type:String,
        default:''
    },
    city:{
        type:String,
        default:''
    },
    zip:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        required:true
    },
    isAdmin:{
      type:Boolean,
      default:false
    }
    
})

userSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

userSchema.set('toJSON',{
   virtuals:true
})

//node model for schema product
exports.User=mongoose.model('User',userSchema)