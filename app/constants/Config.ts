import Constants from 'expo-constants';

// API Configuration
export const API_URL = Constants.expoConfig?.extra?.SERVER_URL || 'http://localhost:4000';

// App Configuration
export const APP_NAME = 'Quiz App';
export const APP_SUBTITLE = 'Master Aptitude & Technical MCQs';

// Colors
export const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
};

// Quiz Categories
export const QUIZ_CATEGORIES = [
  {
    id: 'aptitude',
    title: '🧮 Aptitude',
    description: 'Quantitative & Logical Reasoning',
    color: COLORS.primary,
  },
  {
    id: 'technical',
    title: '💻 Technical',
    description: 'Programming & Computer Science',
    color: COLORS.success,
  },
  {
    id: 'general',
    title: '🧠 General Knowledge',
    description: 'Current Affairs & GK',
    color: COLORS.warning,
  },
  {
    id: 'data',
    title: '📊 Data Analysis',
    description: 'Charts, Graphs & Statistics',
    color: COLORS.info,
  },
];
