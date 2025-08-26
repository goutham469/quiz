import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface SuccessScreenProps {
  userData: any;
  onReset: () => void;
}

export default function SuccessScreen({ userData, onReset }: SuccessScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.successIcon}>🎉</ThemedText>
        </View>
        
        <ThemedText type="title" style={styles.successTitle}>
          Welcome to Quiz App!
        </ThemedText>
        
        <ThemedText type="subtitle" style={styles.successSubtitle}>
          {userData?.isNewUser ? 'Account created successfully!' : 'Login successful!'}
        </ThemedText>
        
        {userData?.user && (
          <View style={styles.userInfo}>
            <View style={styles.userDetail}>
              <ThemedText style={styles.userLabel}>Name:</ThemedText>
              <ThemedText style={styles.userValue}>{userData.user.name}</ThemedText>
            </View>
            <View style={styles.userDetail}>
              <ThemedText style={styles.userLabel}>Email:</ThemedText>
              <ThemedText style={styles.userValue}>{userData.user.email}</ThemedText>
            </View>
            <View style={styles.userDetail}>
              <ThemedText style={styles.userLabel}>Member since:</ThemedText>
              <ThemedText style={styles.userValue}>
                {new Date(userData.user.created_on).toLocaleDateString()}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onReset}
        style={styles.primaryButton}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Sign In with Different Account
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    gap: 20,
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 30,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d4edda',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successIcon: {
    fontSize: 40,
  },
  successTitle: {
    color: '#155724',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  successSubtitle: {
    color: '#155724',
    textAlign: 'center',
    fontSize: 16,
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  userValue: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
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
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
