import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { fetchQuestions, startNewQuiz } from '@/store/slices/quizSlice';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/constants/Config';
import { router } from 'expo-router';

export default function GKScreen() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.quiz);
  const [selectedCount, setSelectedCount] = useState(10);

  const questionCounts = [5, 10, 15, 20, 25];

  const handleStartQuiz = async () => {
    try {
      const questions = await dispatch(fetchQuestions({ 
        category: 'gk', 
        count: selectedCount 
      })).unwrap();
      
      dispatch(startNewQuiz({ category: 'General Knowledge', questions }));
      router.push('/quiz-exam');
    } catch (error) {
      Alert.alert('Error', 'Failed to start quiz. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          General Knowledge Quiz
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Test your knowledge of current affairs and general topics
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            Quiz Information
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Multiple choice questions with 4 options{'\n'}
            • Questions cover current affairs and GK{'\n'}
            • Timer will be shown during the quiz{'\n'}
            • You can review your answers before submitting
          </ThemedText>
        </View>

        <View style={styles.countSelector}>
          <ThemedText type="subtitle" style={styles.countTitle}>
            Select Number of Questions
          </ThemedText>
          <View style={styles.countGrid}>
            {questionCounts.map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countButton,
                  selectedCount === count && styles.selectedCountButton
                ]}
                onPress={() => setSelectedCount(count)}
              >
                <ThemedText
                  style={[
                    styles.countButtonText,
                    selectedCount === count && styles.selectedCountButtonText
                  ]}
                >
                  {count}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.disabledButton]}
          onPress={handleStartQuiz}
          disabled={isLoading}
        >
          <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
            {isLoading ? 'Preparing Quiz...' : `Start ${selectedCount} Questions Quiz`}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 30,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 15,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 22,
  },
  countSelector: {
    gap: 15,
  },
  countTitle: {
    fontSize: 18,
    color: '#495057',
    fontWeight: '600',
  },
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  countButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCountButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  countButtonText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '600',
  },
  selectedCountButtonText: {
    color: '#ffffff',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
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
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
