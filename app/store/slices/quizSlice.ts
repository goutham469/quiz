import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '@/constants/Config';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  category: string;
}

interface QuizAttempt {
  id: number;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  attemptedAt: string;
  responses: QuestionResponse[];
}

interface QuestionResponse {
  questionId: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

interface QuizState {
  currentQuestions: Question[];
  currentAttempt: QuizAttempt | null;
  currentQuestionIndex: number;
  isLoading: boolean;
  error: string | null;
  attempts: QuizAttempt[];
}

const initialState: QuizState = {
  currentQuestions: [],
  currentAttempt: null,
  currentQuestionIndex: 0,
  isLoading: false,
  error: null,
  attempts: [],
};

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async ({ category, count = 10 }: { category: string; count?: number }) => {
    const response = await fetch(`${API_URL}/quiz/questions?category=${category}&count=${count}`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch questions');
    }
    return data.questions;
  }
);

export const submitQuizAttempt = createAsyncThunk(
  'quiz/submitAttempt',
  async (attemptData: Omit<QuizAttempt, 'id' | 'attemptedAt'> & { userEmail: string }) => {
    const response = await fetch(`${API_URL}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attemptData),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to submit attempt');
    }
    return data.attempt;
  }
);

export const fetchUserAttempts = createAsyncThunk(
  'quiz/fetchAttempts',
  async (userEmail: string) => {
    const response = await fetch(`${API_URL}/quiz/attempts/${encodeURIComponent(userEmail)}`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch attempts');
    }
    return data.attempts;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    answerQuestion: (state, action: PayloadAction<{ questionId: number; selectedOptionIndex: number }>) => {
      const { questionId, selectedOptionIndex } = action.payload;
      const question = state.currentQuestions.find(q => q.id === questionId);
      
      if (question && state.currentAttempt) {
        const existingResponse = state.currentAttempt.responses.find(r => r.questionId === questionId);
        if (existingResponse) {
          existingResponse.selectedOptionIndex = selectedOptionIndex;
          existingResponse.isCorrect = selectedOptionIndex === question.correctOptionIndex;
        } else {
          state.currentAttempt.responses.push({
            questionId,
            selectedOptionIndex,
            isCorrect: selectedOptionIndex === question.correctOptionIndex,
          });
        }
      }
    },
    startNewQuiz: (state, action: PayloadAction<{ category: string; questions: Question[] }>) => {
      state.currentQuestions = action.payload.questions;
      state.currentQuestionIndex = 0;
      state.currentAttempt = {
        id: Date.now(), // Temporary ID
        category: action.payload.category,
        score: 0,
        totalQuestions: action.payload.questions.length,
        correctAnswers: 0,
        attemptedAt: new Date().toISOString(),
        responses: [],
      };
    },
    finishQuiz: (state) => {
      if (state.currentAttempt) {
        const correctAnswers = state.currentAttempt.responses.filter(r => r.isCorrect).length;
        state.currentAttempt.correctAnswers = correctAnswers;
        state.currentAttempt.score = (correctAnswers / state.currentAttempt.totalQuestions) * 100;
        state.attempts.push(state.currentAttempt);
      }
    },
    clearCurrentQuiz: (state) => {
      state.currentQuestions = [];
      state.currentAttempt = null;
      state.currentQuestionIndex = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuestions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch questions';
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        // Update the attempt with server data if needed
        if (state.currentAttempt) {
          state.currentAttempt.id = action.payload.id;
        }
      })
      .addCase(fetchUserAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload;
      });
  },
});

export const {
  setCurrentQuestionIndex,
  answerQuestion,
  startNewQuiz,
  finishQuiz,
  clearCurrentQuiz,
  clearError,
} = quizSlice.actions;

export default quizSlice.reducer;
