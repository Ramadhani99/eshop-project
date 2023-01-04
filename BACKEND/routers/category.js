
const express=require('express')
const router=express.Router();
const {Category}=require('../models/category');
const { route } = require('./product');

router.get(`/`,async (req,res)=>{
    const categoryList=await Category.find()
    if(!categoryList){
        return res.status(500).json({success:false})
    }     
    res.status(200).send(categoryList)
})

//get by id

router.get('/:id', async (req,res)=>{
    const category= await Category.findById(req.params.id)

    if(!category){
      return res.status(500).json({message:'category with given ID was not found'})
    }
    return res.status(200).send(category)
        

})

//post
router.post(`/`, async (req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color

    })
    category = await category.save()
    if(!category){
        return res.status(500).send('the category can not be creeated')
    }
    res.send(category)
    // category.save().then( createdCategory=>{
    //     res.status(201).json(createdCategory)
    // } ).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
    //res.send(newProduct)
})

//delete categories

router.delete('/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(
        category=>{
            if(category){
                return res.status(200).json({success:true,message:'the categoy is deleted'})
            }else{
              return res.status(404).json({success:false,message:'category not found'})
            }
        }
    ).catch((err)=>{
        return res.status(500).json({success:false,error:err})
    })
})

//update categories
router.put('/:id',async (req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color
        },{new:true}//get new updatd data
        )

        if(!category){
            return res.status(500).send('the category can not be updated')
        }
        res.send(category)

})

module.exports=router