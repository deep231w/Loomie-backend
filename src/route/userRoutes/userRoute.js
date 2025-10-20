import express from 'express';

const router = express.Router();

router.get('/signup',async(req,res)=>{

    res.status(200).send("signup success");
    
})


export default router;