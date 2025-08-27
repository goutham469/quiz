import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { fetchUserAttempts } from '@/store/slices/quizSlice';
import { ThemedText } from '@/components/ThemedText';
import { COLORS } from '@/constants/Config';

export default function AttemptsScreen() {
  const dispatch = useDispatch();
  const { attempts, isLoading } = useSelector((state: RootState) => state.quiz);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserAttempts(user.id));
    }
  }, [dispatch, user?.id]);

  const renderAttempt = ({ item }: { item: any }) => (
    <View style={styles.attemptCard}>
      <View style={styles.attemptHeader}>
        <ThemedText type="defaultSemiBold" style={styles.categoryText}>
          {item.category}
        </ThemedText>
        <ThemedText style={styles.dateText}>
          {new Date(item.attemptedAt).toLocaleDateString()}
        </ThemedText>
      </View>
      
      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          <ThemedText style={styles.scoreLabel}>Score</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.scoreValue}>
            {item.score.toFixed(1)}%
          </ThemedText>
        </View>
        
        <View style={styles.scoreItem}>
          <ThemedText style={styles.scoreLabel}>Correct</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.scoreValue}>
            {item.correctAnswers}/{item.totalQuestions}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading attempts...</ThemedText>
      </View>
    );
  }

  if (attempts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText type="title" style={styles.emptyTitle}>
            No Tests Attempted Yet
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Start taking quizzes to see your attempts here!
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Test History
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Your quiz attempts and scores
        </ThemedText>
      </View>
      
      <FlatList
        data={attempts}
        renderItem={renderAttempt}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    padding: 20,
  },
  attemptCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#6c757d',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    color: '#495057',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});
