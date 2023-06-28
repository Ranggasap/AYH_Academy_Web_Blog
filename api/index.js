import express from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"
 
const app = express()
app.use(cookieParser())
app.use(cors({
    origin: 'https://www.ayhacademy.com',
	  credentials: true
}))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
});
  
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file
    console.log(file)
    res.status(200).json(file.filename)
})

app.use(express.json())

app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)


app.listen(8800, ()=>{
    console.log("Connect")
})