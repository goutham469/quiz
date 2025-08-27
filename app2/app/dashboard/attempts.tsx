import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import ReactAsyncStorageAPI from '@/services/storage'
import API from '@/services/API'

const { width } = Dimensions.get('window');

const Attempts = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    async function getUserAttempts() {
        try {
            const user = await ReactAsyncStorageAPI.get("user");
            const response = await API.user_attempts({ email: JSON.parse(user).email });
            if (response.success) {
                setAttempts(response.attempts);
            } else {
                alert(response.error);
            }
        } catch (error) {
            alert("Failed to load attempts");
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getScorePercentage = (score, total) => {
        return Math.round((parseFloat(score) / total) * 100);
    };

    const getGradeEmoji = (percentage) => {
        if (percentage >= 90) return '🏆';
        if (percentage >= 80) return '🥇';
        if (percentage >= 70) return '🥈';
        if (percentage >= 60) return '🥉';
        return '📚';
    };

    const getCategoryEmoji = (category) => {
        const categoryEmojis = {
            'Math': '🔢',
            'Science': '🧪',
            'History': '🏛️',
            'Geography': '🌍',
            'Literature': '📖',
            'Technology': '💻',
            'Sports': '⚽',
            'Art': '🎨',
            'Music': '🎵',
        };
        return categoryEmojis[category] || '📚';
    };

    const toggleAttemptDetails = (attemptId) => {
        setSelectedAttempt(selectedAttempt === attemptId ? null : attemptId);
    };

    useEffect(() => {
        getUserAttempts();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Quiz History</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your attempts...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quiz History</Text>
                <Text style={styles.headerSubtitle}>
                    {attempts.length} attempt{attempts.length !== 1 ? 's' : ''} completed
                </Text>
            </View>

            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {attempts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📝</Text>
                        <Text style={styles.emptyTitle}>No Attempts Yet</Text>
                        <Text style={styles.emptyText}>
                            Take your first quiz to see your results here!
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Statistics Summary */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>{attempts.length}</Text>
                                <Text style={styles.statLabel}>Total Attempts</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>
                                    {Math.round(
                                        attempts.reduce((acc, attempt) => 
                                            acc + getScorePercentage(attempt.score, attempt.totalQuestions), 0
                                        ) / attempts.length
                                    )}%
                                </Text>
                                <Text style={styles.statLabel}>Average Score</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>
                                    {attempts.reduce((acc, attempt) => acc + attempt.correctAnswers, 0)}
                                </Text>
                                <Text style={styles.statLabel}>Correct Answers</Text>
                            </View>
                        </View>

                        {/* Attempts List */}
                        <View style={styles.attemptsContainer}>
                            <Text style={styles.sectionTitle}>Recent Attempts</Text>
                            {attempts.map((attempt) => {
                                const percentage = getScorePercentage(attempt.score, attempt.totalQuestions);
                                const isExpanded = selectedAttempt === attempt.id;
                                
                                return (
                                    <View key={attempt.id} style={styles.attemptCard}>
                                        <Pressable
                                            onPress={() => toggleAttemptDetails(attempt.id)}
                                            style={({ pressed }) => [
                                                styles.attemptHeader,
                                                pressed && styles.pressedCard
                                            ]}
                                        >
                                            <View style={styles.attemptMainInfo}>
                                                <View style={styles.attemptTitleRow}>
                                                    <Text style={styles.categoryEmoji}>
                                                        {getCategoryEmoji(attempt.category)}
                                                    </Text>
                                                    <Text style={styles.attemptCategory}>{attempt.category}</Text>
                                                    <Text style={styles.gradeEmoji}>
                                                        {getGradeEmoji(percentage)}
                                                    </Text>
                                                </View>
                                                
                                                <View style={styles.attemptStats}>
                                                    <View style={styles.scoreContainer}>
                                                        <Text style={styles.scoreText}>
                                                            {attempt.correctAnswers}/{attempt.totalQuestions}
                                                        </Text>
                                                        <Text style={styles.percentageText}>{percentage}%</Text>
                                                    </View>
                                                    
                                                    <Text style={styles.dateText}>
                                                        {formatDate(attempt.attemptedAt)}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            <View style={styles.expandIcon}>
                                                <Text style={styles.expandText}>
                                                    {isExpanded ? '▲' : '▼'}
                                                </Text>
                                            </View>
                                        </Pressable>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <View style={styles.attemptDetails}>
                                                {attempt.responses.map((response, index) => (
                                                    <View key={response.id} style={styles.questionDetail}>
                                                        <View style={styles.questionHeader}>
                                                            <Text style={styles.questionNumber}>
                                                                Q{index + 1}
                                                            </Text>
                                                            <View style={[
                                                                styles.answerStatus,
                                                                response.selected_option_index === response.correctOptionIndex 
                                                                    ? styles.correctAnswer 
                                                                    : styles.incorrectAnswer
                                                            ]}>
                                                                <Text style={styles.answerStatusText}>
                                                                    {response.selected_option_index === response.correctOptionIndex ? '✓' : '✗'}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        
                                                        <Text style={styles.questionText}>
                                                            {response.question}
                                                        </Text>
                                                        
                                                        <View style={styles.answersContainer}>
                                                            <Text style={styles.answerLabel}>
                                                                Your answer: <Text style={styles.userAnswer}>
                                                                    {response.options[response.selected_option_index]}
                                                                </Text>
                                                            </Text>
                                                            {response.selected_option_index !== response.correctOptionIndex && (
                                                                <Text style={styles.answerLabel}>
                                                                    Correct answer: <Text style={styles.correctAnswerText}>
                                                                        {response.options[response.correctOptionIndex]}
                                                                    </Text>
                                                                </Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default Attempts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f23',
    },
    header: {
        backgroundColor: '#1a1a2e',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#a0a0a0',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#4c6ef5',
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyEmoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#a0a0a0',
        textAlign: 'center',
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: '#1e1e3f',
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#2a2a4a',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4c6ef5',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#a0a0a0',
        textAlign: 'center',
    },
    attemptsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    attemptCard: {
        backgroundColor: '#1e1e3f',
        borderRadius: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2a2a4a',
        overflow: 'hidden',
    },
    attemptHeader: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pressedCard: {
        backgroundColor: '#252550',
    },
    attemptMainInfo: {
        flex: 1,
    },
    attemptTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryEmoji: {
        fontSize: 20,
        marginRight: 10,
    },
    attemptCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        flex: 1,
    },
    gradeEmoji: {
        fontSize: 20,
    },
    attemptStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginRight: 10,
    },
    percentageText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4c6ef5',
    },
    dateText: {
        fontSize: 14,
        color: '#a0a0a0',
    },
    expandIcon: {
        marginLeft: 15,
    },
    expandText: {
        fontSize: 12,
        color: '#4c6ef5',
    },
    attemptDetails: {
        padding:10,
        borderTopWidth: 1,
        borderTopColor: '#ffffffff',
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
        marginTop: 10,
    },
    questionDetail: {
        backgroundColor: '#000000ff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4c6ef5',
        marginRight: 10,
        minWidth: 30,
    },
    answerStatus: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    correctAnswer: {
        backgroundColor: '#51cf66',
    },
    incorrectAnswer: {
        backgroundColor: '#ff6b6b',
    },
    answerStatusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    questionText: {
        fontSize: 14,
        color: '#ffffff',
        lineHeight: 20,
        marginBottom: 10,
    },
    answersContainer: {
        gap: 5,
    },
    answerLabel: {
        fontSize: 12,
        color: '#a0a0a0',
    },
    userAnswer: {
        color: '#ffffff',
        fontWeight: '500',
    },
    correctAnswerText: {
        color: '#51cf66',
        fontWeight: '500',
    },
});