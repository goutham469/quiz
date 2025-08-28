-- Quiz App Database Schema

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    options JSON NOT NULL, -- Array of 4 options as JSON
    correct_option_index INT NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),
    category ENUM('aptitude', 'general_knowledge', 'technical') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INT, -- Optional: time taken to answer
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Sample questions data
INSERT INTO questions (question, options, correct_option_index, category, difficulty) VALUES
-- Aptitude Questions
('What is 25% of 80?', '["20", "25", "30", "35"]', 0, 'aptitude', 'easy'),
('If a train travels 120 km in 2 hours, what is its speed in km/h?', '["40", "50", "60", "70"]', 2, 'aptitude', 'easy'),
('Complete the sequence: 2, 4, 8, 16, __', '["20", "24", "32", "64"]', 2, 'aptitude', 'medium'),
('A shopkeeper sells an item for $120 and makes a 20% profit. What was the cost price?', '["$80", "$90", "$100", "$110"]', 2, 'aptitude', 'medium'),

-- General Knowledge Questions
('Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 1, 'general_knowledge', 'easy'),
('Who wrote "Romeo and Juliet"?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]', 1, 'general_knowledge', 'easy'),
('What is the capital of Japan?', '["Beijing", "Seoul", "Tokyo", "Bangkok"]', 2, 'general_knowledge', 'easy'),
('Which year did World War II end?', '["1943", "1944", "1945", "1946"]', 2, 'general_knowledge', 'medium'),

-- Technical Questions
('What does CPU stand for?', '["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"]', 0, 'technical', 'easy'),
('Which protocol is used for secure web browsing?', '["HTTP", "HTTPS", "FTP", "SMTP"]', 1, 'technical', 'easy'),
('What is the primary function of RAM?', '["Long-term storage", "Temporary storage", "Processing data", "Displaying graphics"]', 1, 'technical', 'medium'),
('Which programming language is known as the "language of the web"?', '["Java", "Python", "JavaScript", "C++"]', 2, 'technical', 'medium');

-- Create indexes for better performance
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_category ON quiz_attempts(category);
CREATE INDEX idx_quiz_responses_attempt_id ON quiz_responses(attempt_id);
CREATE INDEX idx_quiz_responses_question_id ON quiz_responses(question_id);
('What is the primary function of RAM?', '["Long-term storage", "Temporary storage", "Processing data", "Displaying graphics"]', 1, 'technical', 'medium'),
('Which programming language is known as the "language of the web"?', '["Java", "Python", "JavaScript", "C++"]', 2, 'technical', 'medium');

-- Create indexes for better performance
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_category ON quiz_attempts(category);
CREATE INDEX idx_quiz_responses_attempt_id ON quiz_responses(attempt_id);
CREATE INDEX idx_quiz_responses_question_id ON quiz_responses(question_id);
