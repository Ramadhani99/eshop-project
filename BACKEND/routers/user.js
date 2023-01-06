
const express=require('express')
const router=express.Router();
const {User}=require('../models/user')
const bcrypt=require('bcryptjs')
const mongoose=require('mongoose')
const jwt =require('jsonwebtoken')

router.get(`/`,async (req,res)=>{
    const userList=await User.find().select('-passwordHash')
    res.send(userList)
})

//get specific user
router.get('/:id',async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(500).send('Invalid User Id')
    }
    const user=await User.findById(req.params.id).select('-passwordHash')
    if(!user){
        res.status(500).send("User not found")
    }else{
        res.status(200).send(user)
    }
    
})

//post
router.post(`/`,(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        country:req.body.country,
        street:req.body.street,
        apartment:req.body.apartment,
        city:req.body.city,
        zip:req.body.zip,
    
    

    })
    user.save().then( createdUser=>{
        res.status(201).json(createdUser)
    } ).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    })
    //res.send(newProduct)
})

//update information
//post
router.put(`/:id`,async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(500).send('Invalid User Id')
    }
    const userExist=await User.findById(req.params.id);
    let newPassword
    if(userExist){
        newPassword=userExist.passwordHash
    }else{
      newPassword=bcrypt.hashSync(req.body.password,10)
    }
    const user=await  User.findByIdAndUpdate(
        req.params.id,
        {
        name:req.body.name,
        email:req.body.email,
        passwordHash:newPassword,
        phone:req.body.phone,
        country:req.body.country,
        street:req.body.street,
        apartment:req.body.apartment,
        city:req.body.city,
        zip:req.body.zip,
    },{new:true})
    if(!user){
        return res.status(500).send('the user can not be updated')
    }
    res.send(user)
    //res.send(newProduct)
})

//login
router.post('/login',async (req,res)=>{
    const user=await User.findOne({email:req.body.email})
    //get secret for generate token from enviroment variable
    const secret=process.env.secret
    if(!user){
        res.status(500).send('The user not found')
    }

    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token=jwt.sign({
            userId:user.id,
            isAdmin:user.isAdmin
        },secret,{expiresIn:'1d'})//expire time of token
        res.status(200).send({user:user.email,token:token})
    }else{
        res.status(400).send('password is wrong')
    }
       
    
})


module.exports=router