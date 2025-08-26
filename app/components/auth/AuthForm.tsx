import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { API_URL } from '@/constants/Config';

type AuthStep = 'email' | 'otp' | 'name' | 'success';

interface AuthFormProps {
  onSuccess: (userData: any) => void;
  onStepChange: (step: AuthStep) => void;
}

export default function AuthForm({ onSuccess, onStepChange }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/user/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsNewUser(result.data.isNewUser);
        setCurrentStep('otp');
        onStepChange('otp');
        Alert.alert('Success', 'OTP sent to your email!');
      } else {
        Alert.alert('Error', result.error || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.data.isNewUser) {
          // New user - go to name input step
          setCurrentStep('name');
          onStepChange('name');
        } else {
          // Existing user - login successful
          setCurrentStep('success');
          onStepChange('success');
          onSuccess(result.data);
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to verify OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          name: name.trim(),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentStep('success');
        onStepChange('success');
        onSuccess(result.data);
        Alert.alert('Success', 'Account created successfully! Welcome to Quiz App! 🎉');
      } else {
        Alert.alert('Error', result.error || 'Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setOtp('');
    setName('');
    setCurrentStep('email');
    setIsNewUser(false);
    onStepChange('email');
  };

  const goBackToOTP = () => {
    setCurrentStep('otp');
    onStepChange('otp');
  };

  const renderEmailStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <ThemedText type="subtitle" style={styles.label}>Email Address</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
          placeholderTextColor="#adb5bd"
        />
      </View>

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSendOTP}
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderOTPStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepInfo}>
        <View style={styles.stepItem}>
          <View style={styles.stepIcon}>
            <ThemedText style={styles.stepIconText}>✓</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>Email verified: {email}</ThemedText>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText type="subtitle" style={styles.label}>OTP Code</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          autoFocus
          placeholderTextColor="#adb5bd"
        />
        <ThemedText style={styles.helperText}>
          Check your email for the verification code
        </ThemedText>
      </View>

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleVerifyOTP}
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resetForm}
        style={styles.secondaryButton}
      >
        <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
          Use Different Email
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderNameStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepInfo}>
        <View style={styles.stepItem}>
          <View style={styles.stepIcon}>
            <ThemedText style={styles.stepIconText}>✓</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>Email verified: {email}</ThemedText>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepIcon}>
            <ThemedText style={styles.stepIconText}>✓</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>OTP verified</ThemedText>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText type="subtitle" style={styles.label}>Full Name</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoFocus
          placeholderTextColor="#adb5bd"
        />
        <ThemedText style={styles.helperText}>
          This will be displayed on your profile
        </ThemedText>
      </View>

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleCompleteRegistration}
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goBackToOTP}
        style={styles.secondaryButton}
      >
        <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
          Back to OTP
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentStep === 'email' && renderEmailStep()}
      {currentStep === 'otp' && renderOTPStep()}
      {currentStep === 'name' && renderNameStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    gap: 24,
    width: '100%',
  },
  stepInfo: {
    gap: 12,
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#495057',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#495057',
  },
  helperText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '600',
  },
});
