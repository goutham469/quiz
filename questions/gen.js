const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const GOOGLE_GEN_AI_API_KEY = "AIzaSyAkJNyzl0m2fcr2XZu4ch_RxYw3lnFaPfA";
const ai = new GoogleGenAI({ apiKey: GOOGLE_GEN_AI_API_KEY });

/**
 * Generate questions using Gemini 2.0 Flash
 */
async function generateQuestionsWithAI(topic) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `
You are a model to generate an array of 50 questions for a given topic by the user.
Each question should have:
- The question text
- 4 options labeled A, B, C, D
- The correct option index (0 for A, 1 for B, etc.)
- The category should be the topic itself
- Return only a JSON array like this:

[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "correct_option_index": 0,
    "category": "${topic}"
  }
]

You have to generate medium and advanced and hard problems , all these questions are to be related to Aptitude, you know how Govt exam questions would be right , in that toughtness
Below is the user topic: ${topic} 
            `
        });

        const aiText = response.candidates[0].content.parts[0].text.trim();
        return handleQuestionResponse(aiText, topic);

    } catch (err) {
        console.log("Error generating questions:", err);
        return [];
    }
}

/**
 * Parse AI response and write to a JSON file
 */
async function handleQuestionResponse(aiResponseText, topic) {
    try {
        const jsonStart = aiResponseText.indexOf("[");
        const jsonEnd = aiResponseText.lastIndexOf("]") + 1;
        const jsonString = aiResponseText.substring(jsonStart, jsonEnd);

        const questions = JSON.parse(jsonString);

        const fileName = `${topic.replace(/\s+/g, "_")}_questions.json`;
        fs.writeFileSync(`system_design/${fileName}`, JSON.stringify(questions, null, 2), "utf-8");
        console.log(`Questions saved to file: ${fileName}`);

        return questions;
    } catch (err) {
        console.error("Failed to parse/write questions:", err);
        return [];
    }
}

// ----------------------------
// Example usage
// ----------------------------
(async () => {
    const topic = "Security & Reliability in System design"; // Change topic
    console.log(`working on : ${topic}`)
    const questions = await generateQuestionsWithAI(topic);
    console.log("Generated questions count:", questions.length);
})();


// Functions & Progressions (AP, GP, HP)