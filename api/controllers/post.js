import {db} from "../db.js"
import jwt from "jsonwebtoken"
import path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"

export const getPosts = (req, res)=>{
    const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts"

    db.query(q, [req.query.cat], (err, data)=>{
        if(err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

export const getPost = (req, res)=>{
    const query = "SELECT p.id, `username`, `title`, `description`, p.img, u.img AS userImage, `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?"

    db.query(query, [req.params.id], (err,data) => {
        if(err) return res.status(500).json(err)

        return res.status(200).json(data[0])
    })
}

export const getImage = (req, res) =>{
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    // console.log(__filename)
    const filename = req.params.filename;
    const imagePath = path.join(__dirname,'../upload', filename);
    console.log(imagePath)
    // Send the image file as a response
    res.sendFile(imagePath);
}

export const addPost = (req, res)=>{
    const token = req.cookies['access_token'];
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const query = "INSERT INTO posts (`title`,`description`,`img`, `cat`, `date`, `uid`) VALUES (?)"
        
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]

        db.query(query, [values], (err,data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Post Has Been Added!")
        })
 
    })
}
export const deletePost = (req, res)=>{
    const token = req.cookies['access_token']
    console.log(token)
    if(!token) return res.status(401).json("Not Authenticated!")

    jwt.verify(token, "jwtkey", (err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const query = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?"

        db.query(query, [postId, userInfo.id], (err, data)=>{
            if(err) return res.status(403).json("You can delete only your post!")

            return res.json("Post has been deleted!")
        })
    })

}
export const updatePost = (req, res)=>{
    const token = req.cookies['access_token'];
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id

        const query = "UPDATE posts SET `title` = ?,`description` = ?,`img` = ?, `cat` = ? WHERE `id` = ? AND `uid` = ?"
        
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ]

        db.query(query, [...values, postId, userInfo.id], (err,data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Post Has Been Updated!")
        })
 
    })
}