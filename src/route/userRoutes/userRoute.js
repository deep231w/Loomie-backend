import express from 'express';
import prisma from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/signup',async(req,res)=>{

    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(404).json({
                message:"credential missing "
            })
        }

        const existingUser=await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
            return res.status(400).json({
                message :"email is already in user !!"
            })
        }

        const hashedPassword= await bcrypt.hash(password,10);

        const user= await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        })

        const token= jwt.sign(
            {id:user.id, name:user.name, email:user.email},
            process.env.JWT_SECRET,{expiresIn:'7d'}
        );

        return res.status(201).json({
            message :"user created successfully",
            token:token,
            user:{id:user.id, name:user.name, email:user.email}
        })


    }catch(e){
        console.log("error during signup- ",e);
        return res.status(500).json({
            message:"server error"
        })
    }
})


router.post('/signin', async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"please enter credentials"
            })
        }

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(404).json({
                message:"user not found!"
            })
        }

        const isPasswordMatched= await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(409).json({
                message:"password didnt match / wrong password"
            })
        }

        const token= jwt.sign(
            {id:user.id, name:user.name, email:user.email},
            process.env.JWT_SECRET,{expiresIn:'7d'}
        );

        return res.status(201).json({
            message :"user loggedin successfully!",
            token:token,
            user:{id:user.id, name:user.name, email:user.email}
        })

    }catch(e){
        console.log("error during signin -",e);
        return res.status(500).json({
            message:"server error"
        })
    }
})

export default router;