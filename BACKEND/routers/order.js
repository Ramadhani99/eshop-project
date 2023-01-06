
const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const {Order}=require('../models/order')
const {OrderItem}=require('../models/order-item')

//get all orders
router.get(`/`,async (req,res)=>{
    const orderList=await Order.find().
    populate('user','name').sort({'dateOrderd':-1})
    .populate({path:'orderItems',populate:'product'})
    
    res.send(orderList)
})

//get order by Id 
router.get('/:id',async (req,res)=>{
    const order=await Order.findById(req.params.id).populate('user','name')
    .populate({path:'orderItems',populate:{path:'product',populate:'category'}})
    if(!order){
        res.status(500).send({success:false})
    }
    res.send(order)
})


//post order
router.post(`/`,async (req,res)=>{
    const orderItemsId=Promise.all(req.body.orderItems.map( async orderItem=>{
        let newOrderItem=new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem=await newOrderItem.save()
        return newOrderItem._id;
    }))
   const orderItemIdsResolve = await orderItemsId
   
   const totalPrices=await Promise.all(orderItemIdsResolve.map( async (orderItemId)=>{

    const orderItem=await OrderItem.findById(orderItemId).populate('product','price')
    console.log(orderItem)
    const totalPrice=orderItem.product.price*orderItem.quantity
    return totalPrice;
   }))

   const totalPrice=totalPrices.reduce((a,b)=>a+b,0)
  
    let order=new Order({
       orderItems:orderItemIdsResolve,
       shippingAddress1:req.body.shippingAddress1,
       shippingAddress2:req.body.shippingAddress2,
       city:req.body.city,
       zip:req.body.zip,
       country:req.body.country,
       phone:req.body.phone,
       status:req.body.status,
       totalPrice:totalPrice,
       user:req.body.user,
    })
   order= await order.save()
   if(!order){
    res.status(500).json({
        error:err,
        success:false
    })
   }
    res.status(201).json(order)
   
 //   res.send(order)
})

//update orders
router.put('/:id',async (req,res)=>{
    const order=await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status,
            
        },{new:true}//get new updatd data
        )

        if(!order){
            return res.status(500).send('the order can not be updated')
        }
        res.send(order)

})

//delete order
router.delete('/:id',(req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(
        async order=>{
            if(order){
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndRemove(orderItem)
                })
              
                return res.status(200).json({success:true,message:'the order is deleted'})
            }else{
              return res.status(404).json({success:false,message:'order not found'})
            }
        }
    ).catch((err)=>{
        return res.status(500).json({success:false,error:err})
    })
})

//get total sales
router.get('/get/totalSales',async (req,res)=>{

    const totalSales= await Order.aggregate([
       {$group:{_id:null,totalSales:{$sum:'$totalPrice'}}}
    ])

    if(!totalSales){
        res.status(400).send('The order sales can not be generated')
    }

    res.status(200).send({totalSales:totalSales})

})

//get total count
router.get('/get/count',async (req,res)=>{
   
    const orderCount= await Order.countDocuments()
    if(!orderCount){
        res.status(500).send("No count")
    }
        res.status(200).send({count:orderCount})
    
    
})

//get users orders
router.get(`/get/userorders/:userId`,async (req,res)=>{
    const userOrderList=await Order.find({user:req.params.userId}).
    populate('user','name').sort({'dateOrderd':-1})
    .populate({path:'orderItems',populate:'product'})
    if(!userOrderList){
        res.status(500).send({success:false})
    }
    res.send(UserOrderList)
})

module.exports=router