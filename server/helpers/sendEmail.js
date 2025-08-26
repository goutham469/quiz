const nodemailer = require('nodemailer');

// Create transporter
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });
}

// Send OTP email
async function sendOTPEmail(email, otp) {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Quiz App - Your OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #007bff; margin: 0;">Quiz App</h1>
                        <p style="color: #666; margin: 10px 0;">Email Verification</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <p style="color: #333; font-size: 18px; margin: 0 0 20px 0;">Your verification code is:</p>
                        <div style="background-color: #007bff; color: white; padding: 20px; border-radius: 8px; display: inline-block;">
                            <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">${otp}</h1>
                        </div>
                    </div>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                            ⏰ This code will expire in <strong>5 minutes</strong>
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; text-align: center;">
                        If you didn't request this code, please ignore this email.
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                        Quiz App Team
                    </p>
                </div>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Send OTP email error:', error);
        return { success: false, error: error.message };
    }
}

// Send welcome email
async function sendWelcomeEmail(email, name) {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Welcome to Quiz App! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #007bff; margin: 0;">🎉 Welcome to Quiz App!</h1>
                        <p style="color: #666; margin: 10px 0;">Your account has been created successfully</p>
                    </div>
                    
                    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="color: #155724; margin: 0 0 15px 0;">Hello ${name}! 👋</h2>
                        <p style="color: #155724; margin: 0;">
                            Welcome to Quiz App! You're now ready to start practicing aptitude and technical MCQs.
                        </p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin: 0 0 15px 0;">What's Next?</h3>
                        <ul style="color: #666; margin: 0; padding-left: 20px;">
                            <li>Explore different quiz categories</li>
                            <li>Practice with timed questions</li>
                            <li>Track your progress</li>
                            <li>Compete with others</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                            Start Your First Quiz
                        </a>
                    </div>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                        Quiz App Team
                    </p>
                </div>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Send welcome email error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail
};