const express=require(`express`)

const router=express.Router();



router.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})

// method SEND is from express, while RENDER is from EJS
router.get(`/`,(req,res)=>{
    res.send(`<h1> HI FROM SERVER</h1>`)
})


module.exports=router