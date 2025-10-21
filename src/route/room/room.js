import express from 'express';
import prisma from '../../lib/prisma.js';
import {nanoid} from 'nanoid';

const router= express.Router();

router.post('/create',async(req,res)=>{

    try{
        const {userId}=req.body;
        const roomCode= nanoid(8);

        if(!userId){
            return res.status(404).json({
                message:"userid missing"
            })
        }

        const room= await prisma.room.create({
            data:{
                ownerId:userId,
                code:roomCode
            }
        })

        await prisma.roomUser.create({
            data: {
                userId,
                roomId: room.id,
            },
        });


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

        if(!roomId || !userId){
            return res.status(404).json({
                message:"missing credentials"
            })
        }

        const existingRoom= await prisma.room.findUnique({
            where:{
                id:roomId
            }
        })

        if(!existingRoom){
            return res.status(409).json({
                message :"room didnt found"
            })
        }

        const UserRoom= await prisma.roomUser.create({
            data:{
                userId,
                roomId
            }
        })

        return res.status(201).json({
            message:"joined room successfully",
            UserRoom:UserRoom
        })

        
    }catch(e){
        console.log("error during user join a room- ", e);
        return res.status(500).json({
            message:"server error "
        })
    }
})

export default router;