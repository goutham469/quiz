const pool = require("../helpers/db");
const { getKolkataTime } = require("../helpers/tools");

// ai
const { GoogleGenAI } = require("@google/genai");
const GOOGLE_GEN_AI_API_KEY = process.env.GOOGLE_GEN_AI_API_KEY;
const ai = new GoogleGenAI({ apiKey:GOOGLE_GEN_AI_API_KEY })

async function startInterview( data )
{
    try{
        const { email } = data;
        const [[ user ]] = await pool.query("SELECT user_id FROM user WHERE email=?", [ email ]);

        if(!user || !user.user_id){
            return {
                success:false,
                error:"User not found."
            }
        }else{
            const topic = gdTopics[ Math.floor(Math.random() * 50) ];
            const [ insertStatus ] = await pool.query("INSERT INTO interviews (user_id, topic, started_at) VALUES(?,?,?);", [ user.user_id, topic, getKolkataTime() ] )
            return {
                success:true,
                data:{
                    topic:topic,
                    insertStatus
                }
            }
        }
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function handleUserResponse( data ){
    try{
        // console.log( data );
        const { interview_id, response, topic, conversation } = data;
        const [ insertionStatus ] = await pool.query("INSERT INTO responses ( interview_id, response, submitted_on, speaker ) VALUES(?,?,?,?);", [ interview_id, response, getKolkataTime(), 'USER' ]);
        
        const aiResponse = await getAiResponse( topic, conversation );
        const [ insertionStatus2 ] = await pool.query("INSERT INTO responses ( interview_id, response, submitted_on, speaker ) VALUES(?,?,?,?);", [ interview_id, aiResponse, getKolkataTime(), 'SYSTEM' ]);

        return {
            success:true,
            data:{
                aiResponse:aiResponse,
                insertionStatus,
                insertionStatus2
            }
        }
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function finishInterview( data ){
    try{
        const { interview_id } = data;
        const [ updateStatus ] = await pool.query("UPDATE interviews SET ended_at = ? WHERE id=?", [ getKolkataTime(), interview_id ]);
        return {
            success:true,
            data:{
                updateStatus
            }
        }
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function getUserInterviews( data ) {
  try {
    // 1. Run the query
    const {email} = data;
    const [rows] = await pool.query(
      `
      SELECT i.id, i.topic, i.started_at, i.ended_at, i.score,
             r.response, r.speaker
      FROM interviews AS i
      JOIN responses AS r ON i.id = r.interview_id
      JOIN user ON i.user_id = user.user_id
      WHERE user.email = ?
      ORDER BY i.id, r.id
      `,
      [email]
    );

    // 2. Group rows into interviews
    const interviews = [];
    const map = {};

    rows.forEach(row => {
      if (!map[row.id]) {
        map[row.id] = {
          id: row.id,
          topic: row.topic,
          started_at: row.started_at,
          ended_at: row.ended_at,
          score: row.score,
          responses: []
        };
        interviews.push(map[row.id]);
      }

      map[row.id].responses.push({
        speaker: row.speaker,
        response: row.response
      });
    });

    return {
      success: true,
      data: interviews
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { startInterview, handleUserResponse, getAiResponse, finishInterview, getUserInterviews }


async function getAiResponse( topic, conversation )
{
    try{
        const response = await ai.models.generateContent({
            model:"gemini-2.0-flash",
            contents:`You are in a model that simulates a Group Discussion among 2 members that happens as a part Technical Requitment of Software companies, the topic is ${topic}.
            the responses are of a chat model with USER,SYSTEM as roles, here is the last most conversations among them \n${JSON.stringify(conversation)},
            as candidates in the market as very aggressive and good speakers , you should give strong responses. Give the answer in plain text not more than 50 words.`,
        })

        return response.candidates[0].content.parts[0].text.trim()

    }catch(err){
        console.log(err);
        return "NO"
    }
}

const gdTopics = [
  "Impact of Artificial Intelligence on Jobs",
  "Social Media: Boon or Bane?",
  "Should Mobile Phones be Allowed in Schools?",
  "Climate Change and Its Global Impact",
  "Is Online Education as Effective as Classroom Learning?",
  "Women Empowerment in the 21st Century",
  "Cryptocurrency: Future of Money or Just Hype?",
  "The Role of Youth in Nation Building",
  "Are Electric Vehicles the Future of Transportation?",
  "Work From Home: Productive or Distracting?",
  "Impact of Globalization on Indian Culture",
  "Space Exploration: Is it Worth the Cost?",
  "Freedom of Speech vs. Responsibility",
  "Is Social Media Fueling Fake News?",
  "Should Voting be Made Compulsory?",
  "The Future of E-commerce in India",
  "Technology and Privacy: Striking the Balance",
  "Impact of Movies on Society",
  "Is India Ready for a Cashless Economy?",
  "Nuclear Energy: Clean Energy or a Threat?",
  "Should Homework be Abolished?",
  "Impact of Startups on Indian Economy",
  "Is Censorship Justified in Media?",
  "The Role of Sports in Personality Development",
  "Does Technology Make Us Less Human?",
  "Brain Drain: A Threat to Developing Nations",
  "Should Plastic be Banned Completely?",
  "Impact of OTT Platforms on Traditional Cinema",
  "Corruption: A Major Hindrance to Growth",
  "Will Robots Replace Teachers in the Future?",
  "Is Tourism Good or Bad for the Environment?",
  "The Importance of Emotional Intelligence at Workplace",
  "Can India Become a $5 Trillion Economy?",
  "Impact of Social Media Influencers on Youth",
  "Should Internet Access be a Basic Right?",
  "The Future of Renewable Energy",
  "Is India Prepared for Cybersecurity Threats?",
  "Can Exams Truly Test a Student’s Knowledge?",
  "Should Animals be Used for Scientific Research?",
  "Impact of Gaming on Young Minds",
  "Global Warming: Individual or Government Responsibility?",
  "The Rise of Online Shopping vs. Offline Retail",
  "Is Leadership a Skill or an Inborn Talent?",
  "Impact of Western Culture on Indian Youth",
  "Should Genetic Engineering be Encouraged?",
  "Is Reservation System Still Relevant?",
  "The Future of 5G Technology",
  "Impact of AI on Creativity",
  "Should the Voting Age be Reduced?",
  "Will India Ever Become a Superpower?"
];
