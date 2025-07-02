import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./app.js";
import multer from "multer";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // ✅ Create if not exists
    console.log("✅ Uploads folder created!");
} else {
    console.log("✅ Uploads folder exists!");
}
app.use("/uploads", express.static(uploadDir));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ✅ Unique filename
    }
});
const upload = multer({ storage: storage });
app.use(
    cors({
        origin: "*", // Sabhi origins allowed hain
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ✅ Specific HTTP methods allow kar rahe hain
        allowedHeaders: ["Content-Type", "Authorization"], // ✅ Required headers allow karein
        credentials: true, // ✅ Agar cookies allow karni hain
    })
);
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(routes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
