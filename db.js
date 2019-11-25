import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useFindAndModify: false
    }//새로운 버전의 mongoose가 이런식으로 Configuration을 보낼수 있게 해줌
);

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = error => console.log(`Error on DB Connection: ${error}`);

db.once("open",handleOpen);
db.on("error",handleError);