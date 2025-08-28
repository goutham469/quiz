const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getAiResponse } = require('./controllers/interview.controller');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', require('./routes/user.route'));
app.use('/quiz', require('./routes/quiz.route'));
app.use("/interview", require("./routes/interview.route"))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Quiz App Server is running',
    timestamp: new Date().toISOString()
  });
});

const chat = [
    {
      "USER": "I believe electric vehicles are the future of transportation. They help reduce carbon emissions.",
      "SYSTEM": "That’s true, EVs produce zero tailpipe emissions, which is crucial in fighting climate change."
    },
    {
      "USER": "But don’t you think the high cost of EVs makes them less accessible to common people?",
      "SYSTEM": "Yes, the initial cost is high, but governments are providing subsidies, and battery prices are falling rapidly."
    },
    {
      "USER": "Still, charging infrastructure is not developed enough, especially in rural areas.",
      "SYSTEM": "You’re right, infrastructure is a challenge. However, many countries are investing heavily in building charging stations."
    },
    {
      "USER": "Another concern is the environmental impact of battery production and disposal.",
      "SYSTEM": "That’s a valid point. Research is ongoing in battery recycling and developing eco-friendly alternatives like solid-state batteries."
    },
    {
      "USER": "So overall, EVs may not be perfect now, but they seem to be the direction the world is heading towards.",
      "SYSTEM": "Exactly. While there are challenges, EVs represent a cleaner, sustainable future compared to traditional fossil-fuel vehicles."
    }
  ]


app.get("/test", async(req,res)=>{
  res.send( await getAiResponse( 'Are Electric Vehicles the Future of Transportation?', chat ) )
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 User endpoints: http://localhost:${PORT}/user`);
  console.log(`🧠 Quiz endpoints: http://localhost:${PORT}/quiz`);
});

