import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from './route/userRoutes/userRoute.js';
import roomRoutes from './route/room/room.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/user/v1',userRoute);
app.use('/room/v2',roomRoutes);

app.get("/", (req, res) => {
  res.send("Loomie backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
