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

router.get('/currentroom/:userid', async(req,res)=>{
    try{
        const {userid}=req.params;
        const roomUser= await prisma.roomUser.findFirst({
            where:{
                userId:Number(userid),
            },
            include: { room: true }
        })

        if(!roomUser){
            return res.status(404).json({
                message:"not joined any room",
                inRoom: false
            })
        }

        return res.status(201).json({ inRoom: true, room: roomUser.room });

    }catch(e){
        console.log("error during get userroom", e);
        return res.status(500).json({
            message:"server error"
        })
    }
})


//leave room
router.post('/leave/:roomid', async (req, res) => {
    try{  
    const { roomid } = req.params;
    const { userId } = req.body;

    if (!roomid || !userId) return res.status(400).json({ message: "Missing data" });

    const room = await prisma.room.findUnique({
        where: { id: roomid },
        include: {
        roomUsers: { include: { user: true } },
        owner: true
        }
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    const isOwner = room.ownerId === Number(userId);
    await prisma.roomUser.deleteMany({
        where: { roomId: roomid, userId: Number(userId) }
    });

    if (isOwner) {
        const remainingUsers = room.roomUsers
        .filter(ru => ru.userId !== Number(userId))
        .map(ru => ru.user);

        if (remainingUsers.length > 0) {
        await prisma.room.update({
            where: { id: roomid },
            data: { ownerId: remainingUsers[0].id }
        });
        } else {
        await prisma.room.delete({ where: { id: roomid } });
        }
    }

    return res.status(200).json({ message: "Left room successfully" });
    }catch(e){
        console.log("error during leaving room", e);
        return res.status(500).json({
            message:"server error"
        })
    }

});

//join room by code 

router.post('/joinroombycode',async(req,res)=>{
    try{
        const {userId, roomCode}=req.body;

        if(!userId || !roomCode){
            return res.status(404).json({
                message:"missing credentials"
            })
        }

        const room= await prisma.room.findUnique({
            where:{
                code:roomCode
            }
        })

        if(!room){
            return res.status(400).json({
                message:"room doesnot exist / code didnt match"
            })
        }

        const userRoom= await prisma.roomUser.create({
            data:{
                userId,
                roomId:room.id
            }
        })

        return res.status(201).json({
            message:"joined room successfully",
            UserRoom:userRoom,
            roomJoined:room
        })

    }catch(e){
        console.log("error during add join room",e);
        return res.status(500).json({
            message:"server error"
        })
    }
})


export default router;