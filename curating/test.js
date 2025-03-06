import express from "express";
import connectDB from "./config/database.js";
import curationRoutes from "./routes/curationRoutes.js";
import "dotenv/config";
import cors from "cors";

const app = express();
app.use(cors());
connectDB();
app.use(express.json());

app.use("/api", curationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "서버 에러가 발생했습니다.",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`서버가 실행되었습니다. PORT: ${PORT}`);
});
