import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import router from "./routes/user.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import { GridFSBucket } from 'mongodb';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 4000;

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/yoututor").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("error connecting to db-",err);
});

// initializing GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'channel videos',
    });
});

const corsOptions = {
    origin: true,
    credentials: true
};

//all global middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // temporary storage for uploaded videos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // use the original file name
    }
});
const upload = multer({ storage });

// all routes
app.use(router);

app.listen(port, () => {
    console.log("Server is running on port 4000");
});
