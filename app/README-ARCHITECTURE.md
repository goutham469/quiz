# Quiz App - Modular Architecture

## 🏗️ **Component Architecture**

The app now follows a **modular, scalable component architecture** that separates concerns and makes the code maintainable.

### 📁 **Component Structure**

```
app/
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx          # Handles OTP authentication flow
│   │   └── SuccessScreen.tsx     # Shows success message after auth
│   ├── dashboard/
│   │   └── UserDashboard.tsx     # Main dashboard with profile
│   └── ui/                       # Existing UI components
├── constants/
│   └── Config.ts                 # Centralized configuration
└── app/(tabs)/
    └── index.tsx                 # Main screen orchestrator
```

## 🔧 **Key Components**

### 1. **AuthForm Component**
- **Purpose**: Handles the complete OTP authentication flow
- **Features**: 
  - Email input → OTP verification → Name input (for new users)
  - Step-by-step progression
  - Error handling and validation
- **Props**: `onSuccess`, `onStepChange`

### 2. **UserDashboard Component**
- **Purpose**: Main dashboard after successful authentication
- **Features**:
  - Quiz categories display
  - Profile icon in top-right corner
  - Profile modal with user details
  - Logout functionality
- **Props**: `userData`, `onLogout`

### 3. **SuccessScreen Component**
- **Purpose**: Shows success message and user info
- **Features**: 
  - Welcome message
  - User details display
  - Option to sign in with different account

## 🎨 **Configuration & Constants**

### **Config.ts**
Centralized configuration using your `SERVER_URL` from `app.json`:

```typescript
export const API_URL = Constants.expoConfig?.extra?.SERVER_URL;
export const APP_NAME = 'Quiz App';
export const COLORS = { primary: '#007bff', ... };
export const QUIZ_CATEGORIES = [...];
```

## 🚀 **How It Works**

### **Authentication Flow**
1. **Email Step**: User enters email → OTP sent
2. **OTP Step**: User enters OTP → System checks if new/existing user
3. **Name Step**: New users enter name → Account created
4. **Success**: Welcome message → Navigate to dashboard

### **Dashboard Flow**
1. **Main View**: Quiz categories + Profile icon
2. **Profile Modal**: User details + Stats + Logout
3. **Navigation**: Seamless between auth and dashboard states

## ✅ **Benefits of New Architecture**

- **🔧 Modular**: Each component has a single responsibility
- **📱 Scalable**: Easy to add new features and components
- **🎨 Consistent**: Centralized colors, config, and styling
- **🔄 Reusable**: Components can be used in other parts of the app
- **🐛 Maintainable**: Easier to debug and update
- **📖 Readable**: Clear separation of concerns

## 🎯 **Usage Examples**

### **Adding New Quiz Categories**
```typescript
// In Config.ts
export const QUIZ_CATEGORIES = [
  // ... existing categories
  {
    id: 'new-category',
    title: '🆕 New Category',
    description: 'Description here',
    color: COLORS.warning,
  },
];
```

### **Adding New Auth Steps**
```typescript
// In AuthForm.tsx
type AuthStep = 'email' | 'otp' | 'name' | 'newStep' | 'success';
```

### **Customizing Colors**
```typescript
// In Config.ts
export const COLORS = {
  primary: '#your-color',
  // ... other colors
};
```

## 🔄 **State Management**

The app uses **local state management** with React hooks:
- `currentStep`: Tracks authentication progress
- `appState`: Tracks if user is in auth or dashboard
- `userData`: Stores authenticated user information

## 📱 **Responsive Design**

- **Mobile-first**: Optimized for mobile devices
- **Flexible layouts**: Adapts to different screen sizes
- **Touch-friendly**: Proper touch targets and spacing

The new architecture makes the app **professional, maintainable, and ready for future enhancements**! 🎉
