
const express=require('express');
const { Category } = require('../models/category');
const router=express.Router();
const {Product}=require('../models/product')

const mongoose=require('mongoose')

//get all products
router.get(`/`,async (req,res)=>{
    let filter={}
    if(req.query.categories){
        filter={category:req.query.categories.split(',')}
    }
    const productList=await Product.find(filter)
    res.send(productList)
})

//get product by Id
router.get('/:id',async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(500).send('Invalid Product Id')
    }
    const product=await Product.findById(req.params.id).populate('category')
    if(!product){
        res.status(500).send("product with give ID not found")
    }else{
        res.status(200).send(product)
    }
    
})

//get products counts
router.get('/get/count',async (req,res)=>{
   
    const productCount= await Product.countDocuments()
    if(!productCount){
        res.status(500).send("No count")
    }
        res.status(200).send({count:productCount})
    
    
})

//get featured products
router.get('/get/featured/:count',async (req,res)=>{
     //limt
    const count=req.params.count ? req.params.count : 0
    console.log(count)
    const product= await Product.find({
        isFeatured:true
    }).limit(+count)
    if(!product){
        res.status(500).send("No Featured product")
    }
        res.status(200).send(product)
    
    
})


//post
router.post(`/`,async (req,res)=>{
    const category= await Category.findById(req.body.category)
    if(!category) res.status(500).send({message:"invalid category"})
    const product=new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    })
    product.save().then( createdProduct=>{
        res.status(201).json(createdProduct)
    } ).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    })
    //res.send(newProduct)
})

//updates product
router.put('/:id',async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(500).send('Invalid Product Id')
    }
    if(!mongoose.isValidObjectId(req.body.category)){
        res.status(500).send('Invalid Category Id')
    }
    const category= await Category.findById(req.body.category)
    if(!category) res.status(500).send({message:"invalid category"})
    const product=await Product.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:req.body.image,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured
        },{new:true}//get new updatd data
        )

        if(!product){
            return res.status(500).send('the product can not be updated')
        }
        res.send(product)

})

//delete products
router.delete('/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(
        product=>{
            if(product){
                return res.status(200).json({success:true,message:'the product is deleted'})
            }else{
              return res.status(404).json({success:false,message:'product not found'})
            }
        }
    ).catch((err)=>{
        return res.status(500).json({success:false,error:err})
    })
})

module.exports=router