import express from "express";
import cors from "cors";

const app = express();
const port = 4000;

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log("Server is running on port 4000");
});