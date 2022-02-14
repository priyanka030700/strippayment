const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("pk_test_51KQoqvSI2gxL9Nho3JzgLJ0SnQXtKgWDm0wq6E340oBeYdY3dL6aoAlbQIs9SqUwrcwRdaSjPr9s19J2QGcvqZPL00VYAGYQXa");
const uuid = require("uuid");
const app =express();
//middleware
app.use(express.json());
app.use(cors());
// router
app.get("/",(req,res) =>{
res.send("it works at port");
});
app.post("/payment",(req,res)=>{
 const {product,token} =req.body;
 console.log("product",product);
 console.log("price",product.price);
 const idempotencykey =uuid()
 return stripe.customer.create({
     email:token.email,
     source:token.id
 }).then(customer =>{
     stripe.charges.create({
         amount:product.price*100,
         currency:'usd',
         customer:customer.id,
         receipt_email:token.email,
         description:`purchase of product.name`,
         shipping:{
             name:token.card.name,
             address:{
                 country:token.card.address_country
             }
         }
     },{idempotencykey})
 })
 .then(result =>res.status(200).json(result))
 .catch(err => console.log(err))

})
//listining
app.listen(8000, () => console.log("listen to the port 8000"));