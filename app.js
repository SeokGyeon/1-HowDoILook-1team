import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import styleRoutes from "./routes/styleRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/styles", styleRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
