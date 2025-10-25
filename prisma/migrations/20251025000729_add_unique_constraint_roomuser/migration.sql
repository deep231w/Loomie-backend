/*
  Warnings:

  - A unique constraint covering the columns `[userId,roomId]` on the table `RoomUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_userId_roomId_key" ON "RoomUser"("userId", "roomId");
