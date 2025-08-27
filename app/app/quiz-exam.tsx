import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { answerQuestion, setCurrentQuestionIndex } from '@/store/slices/quizSlice';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { COLORS } from '@/constants/Config';
import { router } from 'expo-router';

export default function QuizExamScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestions, currentQuestionIndex, currentAttempt } = useSelector(
    (state: RootState) => state.quiz
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;

  if (!currentQuestion || !currentAttempt) {
    return (
      <View style={styles.container}>
        <ThemedText>No quiz data found. Please start a new quiz.</ThemedText>
      </View>
    );
  }

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      dispatch(answerQuestion({
        questionId: currentQuestion.id,
        selectedOptionIndex: selectedAnswer,
      }));
    }

    if (isLastQuestion) {
      router.push('/quiz-summary');
    } else {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
      // Get previous answer if exists
      const prevResponse = currentAttempt.responses.find(
        r => r.questionId === currentQuestions[currentQuestionIndex - 1].id
      );
      setSelectedAnswer(prevResponse?.selectedOptionIndex ?? null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionCard}>
          <ThemedText type="subtitle" style={styles.questionText}>
            {currentQuestion.question}
          </ThemedText>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionIndicator,
                  selectedAnswer === index && styles.selectedIndicator
                ]}>
                  <ThemedText style={[
                    styles.optionLetter,
                    selectedAnswer === index && styles.selectedOptionLetter
                  ]}>
                    {String.fromCharCode(65 + index)}
                  </ThemedText>
                </View>
                <ThemedText style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText
                ]}>
                  {option}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <IconSymbol name="chevron.left" size={20} color="#ffffff" />
          <ThemedText style={styles.navButtonText}>Previous</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <ThemedText style={styles.navButtonText}>
            {isLastQuestion ? 'Finish' : 'Next'}
          </ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#ffffff" />
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
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  progressContainer: {
    gap: 10,
  },
  questionCounter: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 18,
    color: '#495057',
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f8ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 15,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: COLORS.primary,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  selectedOptionLetter: {
    color: '#ffffff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
    opacity: 0.6,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
