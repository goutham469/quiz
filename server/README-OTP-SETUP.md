# OTP Authentication Setup

## What I've Added

✅ **Simple Email + OTP Authentication System**
- No more complex Google OAuth setup
- Clean, beginner-friendly implementation
- Secure 6-digit OTP with 5-minute expiry
- **NEW**: Step-by-step registration flow
- **NEW**: Welcome emails for new users

## New Endpoints

1. **POST `/user/send-otp`** - Send OTP to email
   ```json
   { "email": "user@example.com" }
   ```

2. **POST `/user/verify-otp`** - Verify OTP and login/register
   ```json
   { 
     "email": "user@example.com", 
     "otp": "123456", 
     "name": "User Name" // required for new users
   }
   ```

## Frontend Registration Flow

### Step 1: Email Input
- User enters email address
- Clicks "Send OTP"
- OTP sent to email

### Step 2: OTP Verification
- User enters 6-digit OTP
- System checks if user exists
- If existing user → Login successful
- If new user → Proceed to Step 3

### Step 3: Name Input (New Users Only)
- User enters full name
- Clicks "Create Account"
- Account created + Welcome email sent

### Step 4: Success
- Welcome message displayed
- User info shown
- Option to sign in with different account

## Setup Steps

### 1. Install Dependencies
```bash
npm install nodemailer
```

### 2. Configure Email (in your .env file)
```env
# Add these to your existing .env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Gmail Setup (if using Gmail)
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an "App Password"
4. Use that app password in EMAIL_PASS

### 4. Test the System
Use the `test-otp.http` file to test:
1. Send OTP to an email
2. Check your email for the 6-digit code
3. Verify the OTP

## How It Works

1. **User enters email** → Clicks "Send OTP"
2. **Server generates 6-digit OTP** → Stores it temporarily (5 min expiry)
3. **Email sent** with OTP code
4. **User enters OTP** → Clicks "Verify OTP"
5. **Server verifies OTP** → Determines if new or existing user
6. **If new user** → Prompts for name → Creates account → Sends welcome email
7. **If existing user** → Login successful
8. **Success response** shown on screen

## Benefits

- ✅ **Simple**: No complex OAuth setup
- ✅ **Secure**: OTP expires in 5 minutes
- ✅ **User-friendly**: Clear step-by-step process
- ✅ **Flexible**: Works for both new and existing users
- ✅ **Reliable**: No dependency on third-party services
- ✅ **Professional**: Welcome emails for new users
- ✅ **Clear Flow**: Step-by-step registration process

## Files Changed

- `server/helpers/otp.js` - OTP generation and verification
- `server/helpers/sendEmail.js` - Email sending functionality (OTP + Welcome)
- `server/controllers/user.controller.js` - Added OTP functions + welcome emails
- `server/routes/user.route.js` - Added OTP endpoints
- `app/app/(tabs)/index.tsx` - New step-by-step OTP UI

## Email Templates

- **OTP Email**: Professional verification email with 6-digit code
- **Welcome Email**: Beautiful welcome message for new users with next steps

The system is now much simpler, more professional, and easier to use! 🎉
