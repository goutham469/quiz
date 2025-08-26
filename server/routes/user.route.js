const express = require('express')
const { userAuth, sendOTP, verifyOTPAndAuth } = require('../controllers/user.controller')
const userRouter = express.Router()

userRouter.get('/', (req,res)=>{
    res.send("user router")
})

// Legacy Google auth endpoint (keeping for backward compatibility)
userRouter.post("/auth", async (req,res)=>{
    try{
        const { email, profile_pic, name } = req.body;
        res.send( await userAuth( email, profile_pic, name ) );
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})

// New OTP-based authentication endpoints
userRouter.post("/send-otp", async (req,res)=>{
    try{
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Email is required"
            });
        }
        const result = await sendOTP(email);
        res.json(result);
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
})

userRouter.post("/verify-otp", async (req,res)=>{
    try{
        const { email, otp, name } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: "Email and OTP are required"
            });
        }
        const result = await verifyOTPAndAuth(email, otp, name);
        res.json(result);
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
})

module.exports = userRouter;