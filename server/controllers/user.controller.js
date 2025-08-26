const pool = require("../helpers/db");
const { getKolkataTime } = require("../helpers/tools");
const { generateOTP, storeOTP, verifyOTP } = require("../helpers/otp");
const { sendOTPEmail, sendWelcomeEmail } = require("../helpers/sendEmail");

async function userAuth( email, profile_pic, name )
{
    try{
        console.log("new auth came...");
        
        const [[user]] = await pool.query("SELECT * FROM user WHERE email=?", [ email ]);
        if(user){
            return {
                success:true,
                data:{
                    user,
                    message:"Login success"
                }
            }
        }
        else{
            const [status] = await pool.query("INSERT INTO user (email,profile_pic,created_on,name) VALUES(?,?,?,?)", [ email, profile_pic, getKolkataTime(), name ]);
            return {
                success:true,
                data:{
                    message:"A/C created",
                    status:status
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

// Send OTP to email
async function sendOTP(email) {
    try {
        console.log("OTP request for:", email);
        
        // Check if user exists
        const [[user]] = await pool.query("SELECT * FROM user WHERE email=?", [email]);
        
        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(email, otp);
        
        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp);
        
        if (emailResult.success) {
            return {
                success: true,
                data: {
                    message: user ? "OTP sent to registered email" : "OTP sent to email",
                    isNewUser: !user
                }
            };
        } else {
            return {
                success: false,
                error: "Failed to send OTP email"
            };
        }
        
    } catch (err) {
        console.error("Send OTP error:", err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Verify OTP and authenticate user
async function verifyOTPAndAuth(email, otp, name = null) {
    try {
        console.log("OTP verification for:", email);
        
        // Verify OTP
        const otpResult = verifyOTP(email, otp);
        if (!otpResult.valid) {
            return {
                success: false,
                error: otpResult.message
            };
        }
        
        // Check if user exists
        const [[user]] = await pool.query("SELECT * FROM user WHERE email=?", [email]);
        
        if (user) {
            // Existing user - login successful
            return {
                success: true,
                data: {
                    user,
                    message: "Login successful",
                    isNewUser: false
                }
            };
        } else {
            
            
            const [status] = await pool.query(
                "INSERT INTO user (email, created_on, name) VALUES(?,?,?)", 
                [email, getKolkataTime(), "user"]
            );
            
            // Send welcome email to new user
            try {
                await sendWelcomeEmail(email, "user");
                console.log("Welcome email sent to:", email);
            } catch (emailError) {
                console.log("Welcome email failed, but account created:", emailError.message);
            }
            
            return {
                success: true,
                data: {
                    message: "Account created successfully",
                    status: status,
                    isNewUser: true
                }
            };
        }
        
    } catch (err) {
        console.error("Verify OTP error:", err);
        return {
            success: false,
            error: err.message
        };
    }
}

module.exports = { 
    userAuth, 
    sendOTP, 
    verifyOTPAndAuth 
}