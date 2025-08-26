// Simple OTP storage (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP with email and expiry (5 minutes)
function storeOTP(email, otp) {
    const expiry = Date.now() + (5 * 60 * 1000); // 5 minutes
    otpStore.set(email, { otp, expiry });
    
    // Clean up expired OTPs
    setTimeout(() => {
        if (otpStore.has(email)) {
            otpStore.delete(email);
        }
    }, 5 * 60 * 1000);
    
    return otp;
}

// Verify OTP
function verifyOTP(email, otp) {
    const stored = otpStore.get(email);
    if (!stored) {
        return { valid: false, message: 'OTP expired or not found' };
    }
    
    if (Date.now() > stored.expiry) {
        otpStore.delete(email);
        return { valid: false, message: 'OTP expired' };
    }
    
    if (stored.otp !== otp) {
        return { valid: false, message: 'Invalid OTP' };
    }
    
    // Remove OTP after successful verification
    otpStore.delete(email);
    return { valid: true, message: 'OTP verified successfully' };
}

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP
};
