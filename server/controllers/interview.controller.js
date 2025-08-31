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
            const topic = gdTopics[ Math.floor(Math.random() * gdTopics.length ) ];
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
  "Will India Ever Become a Superpower?",
  // Current Affairs & India-Centric
  "One Nation, One Election – Is it practical?",
  "Uniform Civil Code – Pros and Cons",
  "India’s Moon Mission (Chandrayaan-3) – A Leap for Space Science",
  "India’s G20 Presidency – Impact on Global Standing",
  "NEP 2020 – Will it Transform Indian Education?",
  "5 Trillion Dollar Economy Vision – Realistic or Overambitious?",
  "India’s Relations with China – Way Forward",
  "The Future of Indo-US Relations",
  "India’s Digital Public Infrastructure – A Model for the World?",
  "Agnipath Scheme – Boon or Bane?",
  "Reservation in Private Sector – Right or Wrong?",
  "India’s Role in BRICS Expansion",
  "Freebies in Elections – Good Governance or Vote Bank Politics?",
  "India’s Start-up Boom – Sustainability Concerns",
  "India’s Population Growth – Demographic Dividend or Burden?",
  "Skill Development in India – Are We Ready for Industry 4.0?",
  "Is India Ready to Replace China as Manufacturing Hub?",
  "India’s Energy Transition – Balancing Growth and Sustainability",
  "2024 Lok Sabha Elections – Impact on Economy & Stability",
  "Make in India vs. Made in India – What Matters More?",

  // International & Global Issues
  "Russia-Ukraine War – Global Economic Implications",
  "Israel-Palestine Conflict – Can Peace be Achieved?",
  "BRICS vs G7 – Who Leads the Future World Order?",
  "Is NATO Still Relevant?",
  "Global Refugee Crisis – Responsibility of Whom?",
  "World after COVID-19 – Lessons Learned",
  "Global Water Scarcity – How to Address It?",
  "World Hunger – Can Technology Solve It?",
  "International Trade Wars – Who Wins?",
  "Global Shift Towards Right-Wing Politics – A Threat to Democracy?",

  // Business, Economy & Jobs
  "Layoffs in Tech Industry – End of IT Job Security?",
  "Impact of Automation on Employment in India",
  "Work-Life Balance in the Hybrid Era",
  "Gig Economy – Future of Employment?",
  "Job Hopping – Smart Move or Lack of Stability?",
  "Is MBA Overrated in Today’s Job Market?",
  "Startups vs. Corporate Jobs – What’s Better?",
  "FDI in Retail – Boon or Bane for Small Businesses?",
  "Is Cryptocurrency Legalization Good for India?",
  "E-commerce Discounts – Beneficial or Predatory?",
  "India’s Stock Market Boom – Bubble or Sustainable?",
  "Are Unicorn Startups Truly Valuable?",
  "Moonlighting – Ethical or Not?",
  "Do Degrees Still Matter in Hiring?",
  "AI vs. Human Intelligence in Corporate Decision Making",
  "Corporate Social Responsibility – Genuine or Just Branding?",
  "Women in Leadership – Breaking the Glass Ceiling",
  "Will 4-day Work Week Improve Productivity?",
  "Future of Manufacturing in India",
  "Is India Ready for Industry 5.0?",

  // Environment & Sustainability
  "India’s Net Zero 2070 Target – Achievable?",
  "Ban on Diesel Vehicles – Right Step or Too Harsh?",
  "Plastic Alternatives – Are They Truly Eco-Friendly?",
  "Are Electric Vehicles Really Green?",
  "Water Conservation – Individual or Government Responsibility?",
  "Urbanization – Threat to Environment?",
  "Deforestation for Development – Justified?",
  "Carbon Tax – Is it Effective?",
  "Smart Cities Mission – Success or Failure?",
  "Is Climate Activism Practical or Theoretical?",

  // Technology & Innovation
  "Generative AI – Tool or Threat?",
  "India’s Semiconductor Mission – Can We Compete with China?",
  "6G Technology – Hype or Future?",
  "Cybersecurity in the Age of AI – Are We Safe?",
  "Deepfakes – Technology Gone Too Far?",
  "Future of Blockchain Beyond Crypto",
  "Is Metaverse the Next Internet Revolution?",
  "Drones – Opportunities and Threats",
  "Digital Health Records – Security Concerns?",
  "Quantum Computing – Game Changer or Overrated?",

  // Education & Youth
  "Coding in Schools – Necessary or Burden?",
  "Marks vs. Skills – What Matters More?",
  "Indian Universities in Global Rankings – What’s Missing?",
  "Should Internships be Mandatory in Colleges?",
  "India’s Brain Drain – Can We Reverse It?",
  "Gap Year after School – Useful or Waste of Time?",
  "Is Rote Learning Still Dominant in India?",
  "Do Online Certifications Hold Real Value?",
  "Student Entrepreneurship – Encouraged or Risky?",
  "Should Indian Universities Allow Foreign Campuses?",

  // Social & Ethical Issues
  "Live-in Relationships – Accepted in Indian Society?",
  "LGBTQ+ Rights – Is India Truly Inclusive?",
  "Marriage Age – Should it be Equal for Men and Women?",
  "Religion in Politics – Necessary or Dangerous?",
  "Freedom of Press in India – Myth or Reality?",
  "Is Capital Punishment Justified?",
  "Should India Legalize Gambling?",
  "Surrogacy – Ethical or Commercial?",
  "Social Media Trials – Fair or Dangerous?",
  "Privacy vs. National Security – Which Comes First?",

  // Sports & Entertainment
  "Is IPL Good for Indian Cricket?",
  "Should Cricket be India’s National Sport?",
  "Sports Quotas – Fair or Unfair?",
  "Hosting Olympics – Boon or Bane for a Country?",
  "Is Bollywood Losing Out to OTT?",
  "Impact of Celebrity Endorsements on Youth",
  "Should India Invest More in Non-Cricket Sports?",
  "Esports – Real Sport or Just Gaming?",
  "Should India Bid for Olympics?",
  "Is Sports a Career Option in India?",

  // Abstract / Creative
  "Red is Better than Blue – Discuss",
  "Time is More Valuable than Money",
  "Can Money Buy Happiness?",
  "Success Depends on Luck or Hard Work?",
  "Work Hard or Work Smart?",
  "Books vs. Internet – Who is the Real Teacher?",
  "Silence is Power – Agree or Disagree?",
  "Is Happiness a State of Mind?",
  "Dreams vs. Reality – What Shapes Us?",
  "Knowledge is Power or Ignorance is Bliss?",

  // Job-Oriented Topics
  "Are Soft Skills More Important than Technical Skills?",
  "Group Discussions – Fair Way of Selection?",
  "Is Leadership Learned on Job or in College?",
  "Should Companies Prioritize Diversity in Hiring?",
  "Is Job Security a Myth Today?",
  "Campus Placements – Are They Enough for Students?",
  "Performance vs. Potential – What Should be Rewarded?",
  "Workplace Politics – Can It Ever End?",
  "Should AI be Used in Recruitment?",
  "Remote Work vs. On-Site Work – What’s the Future?"
];
