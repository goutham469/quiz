const pool = require('../helpers/db');
const { getKolkataTime } = require('../helpers/tools');

// Get questions by category
const getQuestions = async (req, res) => {
  try {
    const { category, count = 10 } = req.query;
    
    if (!category) {
      return res.json({
        success: false,
        error: 'Category parameter is required'
      });
    }
 
    const questionCount = Math.min(parseInt(count), 50); // Max 50 questions

    const query = `
      SELECT id, question, options, correct_option_index, category
      FROM questions 
      WHERE category = ? 
      ORDER BY RAND() 
      LIMIT ?
    `;

    const [questions] = await pool.query(query, [category, questionCount]);

    if (questions.length === 0) {
      return res.json({
        success: false,
        error: 'No questions found for this category'
      });
    }

    console.log(questions)

    // Format questions for frontend
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options , // Parse JSON string to array
      correctOptionIndex: q.correct_option_index,
      category: q.category
    }));

    res.json({
      success: true,
      questions: formattedQuestions,
      count: formattedQuestions.length
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const addQuestions = async (req, res) => {
  try {
    const questions = req.body; // array of questions

    // Convert options array to JSON string
    questions.forEach(q => {
      q.options = JSON.stringify(q.options);
    });

    // Prepare values for bulk insert
    const values = questions.map(q => [
      q.question,
      q.options,
      q.correct_option_index,
      q.category
    ]);

    // Execute bulk insert
    const sql = "INSERT INTO questions (question, options, correct_option_index, category) VALUES ?";
    const [insertionStatus] = await pool.query(sql, [values]);

    res.json({
      success: true,
      data: { insertionStatus }
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
};

const getCategories = async(req,res) => {
  try{
    const [category] = await pool.query("SELECT DISTINCT(category) FROM questions;")
    res.json({
      success:true,
      data:{
        category: category.map( cat => cat.category )
      }
    })

  }catch(err){
    res.json({
      success:false,
      error:err.message
    })
  }
}


// Submit quiz attempt
const submitAttempt = async (req, res) => {
  try {
    const { category, score, total_questions, correctAnswers, responses, userEmail } = req.body;

    console.log("new submit: ",req.body)

    if (!category || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'Category and userEmail are required'
      });
    }

    // Get user ID from email
    const [userResult] = await pool.query('SELECT user_id FROM user WHERE email = ?', [userEmail]);
    if (userResult.length === 0) {
      return res.json({
        success: false,
        error: 'User not found'
      });
    } 
    const userId = userResult[0].user_id;

    // Insert quiz attempt
    const insertAttemptQuery = `
      INSERT INTO quiz_attempts (user_id, category, score, total_questions, correct_answers, responses,attempted_at)
      VALUES (?, ?, ?, ?, ?,?,?)
    `;

    const [result] = await pool.query(insertAttemptQuery, [
      userId, category, score, total_questions, correctAnswers, JSON.stringify( responses ), getKolkataTime()
    ]);

    const attemptId = result.insertId;

    res.json({
      success: true,
      message: 'Quiz attempt submitted successfully',
      attempt: {
        id: attemptId,
        category,
        score,
        total_questions,
        correctAnswers,
        attemptedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
};

// Get user attempts
const getUserAttempts = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'User email is required'
      });
    }

    // Get user ID from email
    const [userResult] = await pool.query('SELECT user_id FROM user WHERE email = ?', [email]);
    if (userResult.length === 0) {
      return res.json({
        success: false,
        error: 'User not found'
      });
    }
    const userId = userResult[0].user_id;

    const [attempts] = await pool.query( `SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY attempted_at DESC ` , [userId]);

    const formattedAttempts = attempts.map(attempt => ({
      id: attempt.id,
      category: attempt.category,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      correctAnswers: attempt.correct_answers,
      attemptedAt: attempt.attempted_at,
      responses: JSON.parse( attempt.responses )
    }));

    res.json({
      success: true,
      attempts: formattedAttempts
    });

  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getQuestions,
  submitAttempt,
  getUserAttempts,
  addQuestions,
  getCategories
};
