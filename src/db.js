import mongoose from "mongoose";
import "./models/Video";
import dotenv from "dotenv"; // 파일을 숨기기 위해 사용(DB와 포트번호 등을 github에 올리지 않게 하기 위하여)
dotenv.config();

mongoose.connect(
  process.env.PRODUCTION === "true"? process.env.MONGO_URL_PROD : process.env.MONGO_URL,{
    useNewUrlParser: true,
    useFindAndModify: false
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = error => console.log(`❌ Error on DB Connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);