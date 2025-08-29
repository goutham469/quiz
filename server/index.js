const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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

app.get('/apk', (req, res) => {
  const filePath = __dirname + '/aptitude.apk';
  res.download(filePath, 'aptitude.apk', (err) => {
    if (err) {
      console.error("Error while sending APK:", err);
      res.status(500).send("Error while downloading the file.");
    }
  });
});

const simpleGit = require('simple-git');
const { getKolkataTime } = require('./helpers/tools');
const git = simpleGit();

app.get('/version', async (req, res) => {
  try {
    const log = await git.log({ maxCount: 1 });
    const commit = log.latest;
    const branch = await git.revparse(['--abbrev-ref', 'HEAD']);

    res.json({
      branch: branch.trim(),
      latestCommit: {
        hash: commit.hash,
        date: getKolkataTime(commit.date) ,
        message: commit.message,
        author: commit.author_name,
      }
    });
  } catch (err) {
    console.error("Error fetching Git version info:", err);
    res.status(500).json({ error: "Unable to fetch version info" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

