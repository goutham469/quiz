const express = require('express');
const { startInterview, handleUserResponse, finishInterview, getUserInterviews } = require('../controllers/interview.controller');
const interviewRouter = express.Router();

interviewRouter.get("/start-interview", async(req,res)=>{
    res.send( await startInterview( req.query ) )
})

interviewRouter.post("/submit-user-response", async(req,res)=>{
    res.send( await handleUserResponse( req.body ) )
})

interviewRouter.put("/finish-interview", async(req,res)=>{
    res.send( await finishInterview( req.body ) )
})

interviewRouter.get("/get-user-interviews", async(req,res)=>{
    res.send( await getUserInterviews(req.query) );
})

module.exports = interviewRouter;