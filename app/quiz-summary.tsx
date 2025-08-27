import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { submitQuizAttempt, clearCurrentQuiz } from '@/store/slices/quizSlice';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/constants/Config';
import { router } from 'expo-router';

export default function QuizSummaryScreen() {
  const dispatch = useDispatch();
  const { currentAttempt, currentQuestions } = useSelector(
    (state: RootState) => state.quiz
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentAttempt && user) {
      // Submit the attempt to server
      dispatch(submitQuizAttempt({
        category: currentAttempt.category,
        score: currentAttempt.score,
        totalQuestions: currentAttempt.totalQuestions,
        correctAnswers: currentAttempt.correctAnswers,
        responses: currentAttempt.responses,
        userId: user.id,
      }));
    }
  }, [dispatch, currentAttempt, user]);

  const handleBackToHome = () => {
    dispatch(clearCurrentQuiz());
    router.push('/(tabs)');
  };

  const handleTakeAnotherQuiz = () => {
    dispatch(clearCurrentQuiz());
    router.push('/(tabs)/aptitude');
  };

  if (!currentAttempt) {
    return (
      <View style={styles.container}>
        <ThemedText>No quiz data found</ThemedText>
      </View>
    );
  }

  const scoreColor = currentAttempt.score >= 70 ? COLORS.success : 
                    currentAttempt.score >= 50 ? COLORS.warning : COLORS.danger;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Quiz Complete! 🎉
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {currentAttempt.category} Quiz Results
        </ThemedText>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <ThemedText type="title" style={styles.scoreTitle}>
              Your Score
            </ThemedText>
          </View>
          
          <View style={styles.scoreDisplay}>
            <ThemedText style={[styles.scoreValue, { color: scoreColor }]}>
              {currentAttempt.score.toFixed(1)}%
            </ThemedText>
            <ThemedText style={styles.scoreLabel}>
              {currentAttempt.correctAnswers} out of {currentAttempt.totalQuestions} correct
            </ThemedText>
          </View>

          <View style={styles.scoreBreakdown}>
            <View style={styles.breakdownItem}>
              <ThemedText style={styles.breakdownLabel}>Correct Answers</ThemedText>
              <ThemedText style={[styles.breakdownValue, { color: COLORS.success }]}>
                {currentAttempt.correctAnswers}
              </ThemedText>
            </View>
            
            <View style={styles.breakdownItem}>
              <ThemedText style={styles.breakdownLabel}>Incorrect Answers</ThemedText>
              <ThemedText style={[styles.breakdownValue, { color: COLORS.danger }]}>
                {currentAttempt.totalQuestions - currentAttempt.correctAnswers}
              </ThemedText>
            </View>
            
            <View style={styles.breakdownItem}>
              <ThemedText style={styles.breakdownLabel}>Accuracy</ThemedText>
              <ThemedText style={[styles.breakdownValue, { color: scoreColor }]}>
                {((currentAttempt.correctAnswers / currentAttempt.totalQuestions) * 100).toFixed(1)}%
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.performanceCard}>
          <ThemedText type="subtitle" style={styles.performanceTitle}>
            Performance Analysis
          </ThemedText>
          
          {currentAttempt.score >= 80 && (
            <View style={styles.performanceItem}>
              <ThemedText style={styles.performanceIcon}>🌟</ThemedText>
              <ThemedText style={styles.performanceText}>
                Excellent! You have a strong understanding of this topic.
              </ThemedText>
            </View>
          )}
          
          {currentAttempt.score >= 60 && currentAttempt.score < 80 && (
            <View style={styles.performanceItem}>
              <ThemedText style={styles.performanceIcon}>👍</ThemedText>
              <ThemedText style={styles.performanceText}>
                Good job! You have a solid foundation with room for improvement.
              </ThemedText>
            </View>
          )}
          
          {currentAttempt.score < 60 && (
            <View style={styles.performanceItem}>
              <ThemedText style={styles.performanceIcon}>📚</ThemedText>
              <ThemedText style={styles.performanceText}>
                Keep practicing! Review the concepts and try again.
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.answersCard}>
          <ThemedText type="subtitle" style={styles.answersTitle}>
            Question Review
          </ThemedText>
          
          {currentQuestions.map((question, index) => {
            const response = currentAttempt.responses.find(r => r.questionId === question.id);
            const isCorrect = response?.isCorrect;
            
            return (
              <View key={question.id} style={styles.questionReview}>
                <View style={styles.questionHeader}>
                  <ThemedText style={styles.questionNumber}>
                    Q{index + 1}
                  </ThemedText>
                  <View style={[
                    styles.resultBadge,
                    isCorrect ? styles.correctBadge : styles.incorrectBadge
                  ]}>
                    <ThemedText style={styles.resultText}>
                      {isCorrect ? '✓' : '✗'}
                    </ThemedText>
                  </View>
                </View>
                
                <ThemedText style={styles.questionText}>
                  {question.question}
                </ThemedText>
                
                {response && (
                  <View style={styles.answerInfo}>
                    <ThemedText style={styles.selectedAnswer}>
                      Your Answer: {question.options[response.selectedOptionIndex]}
                    </ThemedText>
                    {!isCorrect && (
                      <ThemedText style={styles.correctAnswer}>
                        Correct: {question.options[question.correctOptionIndex]}
                      </ThemedText>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleTakeAnotherQuiz}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Take Another Quiz
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBackToHome}
        >
          <ThemedText style={styles.primaryButtonText}>
            Back to Home
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 24,
    color: '#495057',
    fontWeight: '600',
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 25,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6c757d',
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  performanceTitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 15,
    fontWeight: '600',
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performanceIcon: {
    fontSize: 20,
  },
  performanceText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    flex: 1,
  },
  answersCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  answersTitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 15,
    fontWeight: '600',
  },
  questionReview: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  resultBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctBadge: {
    backgroundColor: COLORS.success,
  },
  incorrectBadge: {
    backgroundColor: COLORS.danger,
  },
  resultText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 8,
  },
  answerInfo: {
    gap: 4,
  },
  selectedAnswer: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  correctAnswer: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
