import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentQuestionIndex, answerQuestion, finishQuiz } from '@/store/slices/quizSlice';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/constants/Config';
import { router } from 'expo-router';

export default function QuizExamScreen() {
  const dispatch = useDispatch();
  const { currentQuestions, currentAttempt, currentQuestionIndex } = useSelector(
    (state: RootState) => state.quiz
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  useEffect(() => {
    if (!currentQuestions.length) {
      router.back();
    }
  }, [currentQuestions]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (currentQuestion) {
      dispatch(answerQuestion({
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    } else {
      setShowSummary(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
    }
  };

  const handleFinishQuiz = () => {
    dispatch(finishQuiz());
    router.push('/quiz-summary');
  };

  const handleQuestionNavigation = (index: number) => {
    dispatch(setCurrentQuestionIndex(index));
  };

  const getQuestionStatus = (index: number) => {
    if (!currentAttempt) return 'unanswered';
    const response = currentAttempt.responses.find(r => 
      r.questionId === currentQuestions[index]?.id
    );
    return response ? 'answered' : 'unanswered';
  };

  if (showSummary) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Quiz Summary
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Review your answers before submitting
          </ThemedText>
        </View>

        <ScrollView style={styles.summaryContainer}>
          {currentQuestions.map((question, index) => {
            const response = currentAttempt?.responses.find(r => r.questionId === question.id);
            const status = response ? 'answered' : 'unanswered';
            
            return (
              <View key={question.id} style={styles.summaryItem}>
                <View style={styles.summaryHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.questionNumber}>
                    Question {index + 1}
                  </ThemedText>
                  <View style={[styles.statusBadge, styles[`${status}Badge`]]}>
                    <ThemedText style={styles.statusText}>
                      {status === 'answered' ? '✓' : '?'}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.summaryQuestion}>
                  {question.question.substring(0, 100)}...
                </ThemedText>
                {response && (
                  <ThemedText style={styles.selectedAnswer}>
                    Selected: {question.options[response.selectedOptionIndex]}
                  </ThemedText>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.summaryActions}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowSummary(false)}
          >
            <ThemedText style={styles.backButtonText}>Back to Quiz</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishQuiz}
          >
            <ThemedText style={styles.finishButtonText}>Submit Quiz</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressInfo}>
          <ThemedText style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </ThemedText>
          <ThemedText style={styles.categoryText}>
            {currentAttempt?.category}
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <ThemedText type="subtitle" style={styles.questionText}>
            {currentQuestion.question}
          </ThemedText>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const response = currentAttempt?.responses.find(r => r.questionId === currentQuestion.id);
            const isSelected = response?.selectedOptionIndex === index;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOptionButton
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText
                  ]}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.navigation}>
        <View style={styles.questionPagination}>
          {currentQuestions.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentQuestionIndex === index && styles.activePaginationDot,
                styles[`${getQuestionStatus(index)}Dot`]
              ]}
              onPress={() => handleQuestionNavigation(index)}
            >
              <ThemedText style={styles.paginationText}>
                {index + 1}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ThemedText style={styles.navButtonText}>Previous</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextQuestion}
          >
            <ThemedText style={styles.navButtonText}>
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
            </ThemedText>
          </TouchableOpacity>
        </View>
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
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    color: '#495057',
    fontWeight: '600',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#6c757d',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
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
  questionText: {
    fontSize: 18,
    color: '#495057',
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  selectedOptionButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  navigation: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  questionPagination: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  paginationDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePaginationDot: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  answeredDot: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success,
  },
  unansweredDot: {
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
  },
  paginationText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  navButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.5,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    flex: 1,
    padding: 20,
  },
  summaryItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 16,
    color: '#495057',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answeredBadge: {
    backgroundColor: COLORS.success,
  },
  unansweredBadge: {
    backgroundColor: '#6c757d',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryQuestion: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  selectedAnswer: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 15,
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    flex: 1,
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
