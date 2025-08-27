import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/constants/Config';
import AuthForm from '@/components/auth/AuthForm';
import SuccessScreen from '@/components/auth/SuccessScreen';
import { router } from 'expo-router';

type AuthStep = 'email' | 'otp' | 'name' | 'success';

export default function AuthScreen() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [userData, setUserData] = useState<any>(null);

  const handleAuthSuccess = (data: any) => {
    console.log('Auth success, user data:', data);
    setUserData(data);
    // Don't navigate here - let the navigation guard handle it
  };

  const handleStepChange = (step: AuthStep) => {
    setCurrentStep(step);
  };

  const handleReset = () => {
    setCurrentStep('email');
    setUserData(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.appTitle}>
          Quiz App
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
    color: COLORS.primary,
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
    padding: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
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
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
