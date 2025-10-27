
export default function socketHandler(io) {

    const roomState={}
    const roomChats={}

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);

        socket.on('join_room',({roomId})=>{
            if(!roomId) return;

            socket.join(roomId)
            console.log(`socket id ${socket.id} joined the room ${roomId}`);

            if(!roomState[roomId]){
                roomState[roomId]={
                    videoId: "dQw4w9WgXcQ",
                    currentTime: 0,
                    isPlaying: false,
                    lastUpdate: Date.now()
                }
            }

            // Send current state to the newly joined user
            const state = roomState[roomId];
            socket.emit("sync_state", state);
            socket.emit("chat_history", roomChats[roomId]);


        })

        socket.on("video_action", ({ roomId, action, currentTime }) => {
            if (!roomId || !roomState[roomId]) return;

            const state = roomState[roomId];

            state.currentTime = currentTime;
            state.isPlaying = action === "play" ? true : action === "pause" ? false : state.isPlaying;
            state.lastUpdate = Date.now();

            socket.to(roomId).emit("video_action", { action, currentTime });
        });

        socket.on("change_video",({roomId, videoId})=>{
            if(!roomId || !videoId) return;

                roomState[roomId]={
                    videoId: videoId,
                    currentTime: 0,
                    isPlaying: false,
                    lastUpdate: Date.now()
            }

            socket.to(roomId).emit("change_video", { videoId });

        })

        socket.on("send_message", ({ roomId, user, message }) => {
            if (!roomId || !user || !message) return;

            if (!roomChats[roomId]) roomChats[roomId] = [];

            const msg = {
                id: Date.now(),
                user,
                message,
                timestamp: new Date().toISOString()
            };

            roomChats[roomId].push(msg);

            io.to(roomId).emit("new_message", msg);
        });


        socket.on("join_room", ({ roomId }) => {
            socket.join(roomId);
            io.to(socket.id).emit("chat_history", roomChats[roomId] || []);
        });



        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
  });
}
