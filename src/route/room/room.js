import express from 'express';
import prisma from '../../lib/prisma.js';
import nanoid from 'nanoid';

const router= express.Router();

router.post('/create',async(req,res)=>{

    try{
        const {userId}=req.body;
        const roomCode= nanoid(8);

        const room= await prisma.room.create({
            ownerId:userId,
            code:roomCode
        })

        return res.status(201).json({
            message:"room created successfully!!",
            room:room
        })

    }catch(e){
        console.log("error during create room-", e);
        return res.status(500).json({
            message:"server error"
        })
    }
})

router.post('/join/:roomid',async(req,res)=>{

    try{
        const roomId =req.params.roomid;
        const {userId}=req.body;
        
    }catch(e){
        console.log("error during user join a room- ", e);
        return res.status(500).json({
            message:"server error " && e
        })
    }
})

export default router;