import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { finishQuiz, clearCurrentQuiz, submitQuizAttempt } from '@/store/slices/quizSlice';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { COLORS } from '@/constants/Config';
import { router } from 'expo-router';

export default function QuizSummaryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestions, currentAttempt } = useSelector(
    (state: RootState) => state.quiz
  );

  if (!currentAttempt || !currentQuestions.length) {
    return (
      <View style={styles.container}>
        <ThemedText>No quiz data found.</ThemedText>
      </View>
    );
  }

  const correctAnswers = currentAttempt.responses.filter(r => r.isCorrect).length;
  const totalQuestions = currentQuestions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const handleFinish = async () => {
    const user = useSelector((state: RootState) => state.auth.user);
    
    if (user && currentAttempt) {
      // Submit quiz attempt to server
      try {
        await dispatch(submitQuizAttempt({
          ...currentAttempt,
          userEmail: user.email
        })).unwrap();
      } catch (error) {
        console.error('Failed to save quiz attempt:', error);
      }
    }
    
    dispatch(finishQuiz());
    dispatch(clearCurrentQuiz());
    router.replace('/(tabs)');
  };

  const getScoreColor = () => {
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Quiz Complete!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Here's how you performed
          </ThemedText>
        </View>

        <View style={styles.scoreCard}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
            <ThemedText style={[styles.scoreText, { color: getScoreColor() }]}>
              {percentage}%
            </ThemedText>
          </View>
          <ThemedText style={styles.scoreMessage}>
            {getScoreMessage()}
          </ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={COLORS.success} />
            <ThemedText style={styles.statNumber}>{correctAnswers}</ThemedText>
            <ThemedText style={styles.statLabel}>Correct</ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <IconSymbol name="xmark.circle.fill" size={24} color={COLORS.danger} />
            <ThemedText style={styles.statNumber}>{totalQuestions - correctAnswers}</ThemedText>
            <ThemedText style={styles.statLabel}>Incorrect</ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <IconSymbol name="list.bullet" size={24} color={COLORS.info} />
            <ThemedText style={styles.statNumber}>{totalQuestions}</ThemedText>
            <ThemedText style={styles.statLabel}>Total</ThemedText>
          </View>
        </View>

        <View style={styles.reviewContainer}>
          <ThemedText type="subtitle" style={styles.reviewTitle}>
            Question Review
          </ThemedText>
          
          {currentQuestions.map((question, index) => {
            const response = currentAttempt.responses.find(r => r.questionId === question.id);
            const isCorrect = response?.isCorrect || false;
            
            return (
              <View key={question.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <ThemedText style={styles.reviewQuestionNumber}>
                    Q{index + 1}
                  </ThemedText>
                  <IconSymbol 
                    name={isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill"}
                    size={20}
                    color={isCorrect ? COLORS.success : COLORS.danger}
                  />
                </View>
                <ThemedText style={styles.reviewQuestion}>
                  {question.question}
                </ThemedText>
                <ThemedText style={[
                  styles.reviewAnswer,
                  { color: isCorrect ? COLORS.success : COLORS.danger }
                ]}>
                  Your answer: {question.options[response?.selectedOptionIndex || 0]}
                </ThemedText>
                {!isCorrect && (
                  <ThemedText style={[styles.reviewAnswer, { color: COLORS.success }]}>
                    Correct answer: {question.options[question.correctOptionIndex]}
                  </ThemedText>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <ThemedText style={styles.finishButtonText}>
            Back to Dashboard
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreMessage: {
    fontSize: 18,
    color: '#495057',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  reviewContainer: {
    gap: 15,
  },
  reviewTitle: {
    fontSize: 20,
    color: '#495057',
    fontWeight: '600',
    marginBottom: 10,
  },
  reviewItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewQuestionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  reviewQuestion: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewAnswer: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
