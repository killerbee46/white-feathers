import express from "express";

const router = express.Router();

router.get("/",(req, res)=>{
    res.send(200, { 
        message:"Welcome to Futsal Online Api"
    })
})

export default router