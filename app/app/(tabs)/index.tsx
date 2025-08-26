import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AuthForm from '@/components/auth/AuthForm';
import SuccessScreen from '@/components/auth/SuccessScreen';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { APP_NAME } from '@/constants/Config';

type AuthStep = 'email' | 'otp' | 'name' | 'success';
type AppState = 'auth' | 'dashboard';

export default function HomeScreen() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [appState, setAppState] = useState<AppState>('auth');
  const [userData, setUserData] = useState<any>(null);

  const handleAuthSuccess = (data: any) => {
    setUserData(data);
    setAppState('dashboard');
  };

  const handleStepChange = (step: AuthStep) => {
    setCurrentStep(step);
  };

  const handleReset = () => {
    setCurrentStep('email');
    setAppState('auth');
    setUserData(null);
  };

  const handleLogout = () => {
    setAppState('auth');
    setUserData(null);
    setCurrentStep('email');
  };

  // If user is authenticated, show dashboard
  if (appState === 'dashboard' && userData) {
    return <UserDashboard userData={userData} onLogout={handleLogout} />;
  }

  // Show auth flow
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.appTitle}>
          {APP_NAME}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.appSubtitle}>
          {currentStep === 'email' && 'Sign in with Email + OTP'}
          {currentStep === 'otp' && 'Verify Your Email'}
          {currentStep === 'name' && 'Complete Your Profile'}
          {currentStep === 'success' && 'Welcome!'}
        </ThemedText>
      </View>

      <View style={styles.content}>
        {currentStep === 'success' ? (
          <SuccessScreen userData={userData} onReset={handleReset} />
        ) : (
          <AuthForm 
            onSuccess={handleAuthSuccess}
            onStepChange={handleStepChange}
          />
        )}
      </View>

      {/* Footer with additional links */}
      {currentStep === 'email' && (
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Don't have an account? 
          </ThemedText>
          <TouchableOpacity style={styles.linkButton}>
            <ThemedText style={styles.linkText}>
              Create one here
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  linkButton: {
    padding: 5,
  },
  linkText: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
