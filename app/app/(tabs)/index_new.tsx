import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserAttempts } from '@/store/slices/quizSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { COLORS } from '@/constants/Config';
import { router } from 'expo-router';

interface Stats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  recentAttempts: any[];
}

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { attempts } = useSelector((state: RootState) => state.quiz);
  const [stats, setStats] = useState<Stats>({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    recentAttempts: []
  });

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/auth');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    
    if (user?.email) {
      dispatch(fetchUserAttempts(user.email));
    }
  }, [isAuthenticated, user?.email, dispatch]);

  useEffect(() => {
    if (attempts.length > 0) {
      const totalAttempts = attempts.length;
      const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const averageScore = Math.round(totalScore / totalAttempts);
      const bestScore = Math.max(...attempts.map(attempt => attempt.score || 0));
      const recentAttempts = attempts.slice(0, 5);
      
      setStats({
        totalAttempts,
        averageScore,
        bestScore,
        recentAttempts
      });
    }
  }, [attempts]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <ThemedText type="title" style={styles.welcomeText}>
            Welcome back!
          </ThemedText>
          <ThemedText style={styles.headerSubtext}>
            Ready to challenge yourself today?
          </ThemedText>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <IconSymbol size={80} name="person.circle.fill" color={COLORS.primary} />
          </View>
          
          <ThemedText type="title" style={styles.userName}>
            {user.name}
          </ThemedText>
          
          <ThemedText style={styles.userEmail}>
            {user.email}
          </ThemedText>
          
          <ThemedText style={styles.memberSince}>
            Member since {new Date(user.created_on).toLocaleDateString()}
          </ThemedText>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <ThemedText type="subtitle" style={styles.statsTitle}>
            Quiz Statistics
          </ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.totalAttempts}</ThemedText>
              <ThemedText style={styles.statLabel}>Quizzes Taken</ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.averageScore}%</ThemedText>
              <ThemedText style={styles.statLabel}>Average Score</ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.bestScore}%</ThemedText>
              <ThemedText style={styles.statLabel}>Best Score</ThemedText>
            </View>
          </View>
        </View>

        {/* Recent Attempts */}
        {stats.recentAttempts.length > 0 && (
          <View style={styles.recentCard}>
            <ThemedText type="subtitle" style={styles.recentTitle}>
              Recent Attempts
            </ThemedText>
            
            {stats.recentAttempts.map((attempt, index) => (
              <View key={attempt.id || index} style={styles.attemptItem}>
                <View style={styles.attemptInfo}>
                  <ThemedText style={styles.attemptCategory}>
                    {attempt.category?.charAt(0).toUpperCase() + attempt.category?.slice(1)}
                  </ThemedText>
                  <ThemedText style={styles.attemptDate}>
                    {new Date(attempt.attemptedAt).toLocaleDateString()}
                  </ThemedText>
                </View>
                <View style={[
                  styles.scoreChip,
                  { backgroundColor: attempt.score >= 80 ? COLORS.success : 
                                   attempt.score >= 60 ? COLORS.warning : COLORS.danger }
                ]}>
                  <ThemedText style={styles.scoreText}>{attempt.score}%</ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <ThemedText type="subtitle" style={styles.actionsTitle}>
            Quick Actions
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/attempts')}
          >
            <IconSymbol size={24} name="list.bullet.clipboard.fill" color={COLORS.primary} />
            <ThemedText style={styles.actionText}>View Test History</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/aptitude')}
          >
            <IconSymbol size={24} name="brain.head.profile" color={COLORS.success} />
            <ThemedText style={styles.actionText}>Take Aptitude Test</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/gk')}
          >
            <IconSymbol size={24} name="book.fill" color={COLORS.warning} />
            <ThemedText style={styles.actionText}>Take GK Test</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/technical')}
          >
            <IconSymbol size={24} name="laptopcomputer" color={COLORS.info} />
            <ThemedText style={styles.actionText}>Take Technical Test</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <IconSymbol size={20} name="power" color="#ffffff" />
          <ThemedText style={styles.logoutButtonText}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtext: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: -15,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  profileAvatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#adb5bd',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  recentCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 15,
  },
  attemptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  attemptInfo: {
    flex: 1,
  },
  attemptCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  attemptDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  scoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
