import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import styleRoutes from "./src/routes/styleRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

// URL-encoded 데이터를 파싱하는 미들웨어 추가
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/styles", styleRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`서버가 실행 되었습니다. PORT:${process.env.PORT || 3000}`);
});
