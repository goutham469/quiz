import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import API from '@/services/API'
import ReactAsyncStorageAPI from '@/services/storage'
import { router, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Test = () => {
    const [categories, setCategories] = useState([])
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState()
    const [questionCount, setQuestionCount] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function getCategories() {
        setLoading(true);
        try {
            const response = await API.get_categories();
            if (response.success) {
                setCategories(response.data.category)
            } else {
                alert(response.error)
            }
        } finally {
            setLoading(false);
        }
    }

    function handleCategorySelect(ele) {
        setCategory(ele);
        setStep(step + 1);
    }

    async function getQuestions(n) {
        setLoading(true);
        try {
            const response = await API.get_questions({ category: category, count: n })
            if (response.success) {
                setQuestions(response.questions)
                setStep(step + 1);
            } else {
                alert(response.error)
            }
        } finally {
            setLoading(false);
        }
    }

    function handleQuestionsCountSelect(cnt) {
        setQuestionCount(cnt);
        getQuestions(cnt);
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quiz Master</Text>
                <Text style={styles.headerSubtitle}>Test your knowledge</Text>

            </View>

            <ScrollView 
                style={styles.content} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Step 1: Category Selection */}
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepNumber}>01</Text>
                            <Text style={styles.stepTitle}>Choose Category</Text>
                            <Text style={styles.stepDescription}>Select a topic you'd like to be tested on</Text>
                        </View>
                        
                        <View style={styles.optionsGrid}>
                            {categories && categories.map((cat, index) => (
                                <Pressable 
                                    key={cat}
                                    onPress={() => handleCategorySelect(cat)}
                                    style={({ pressed }) => [
                                        styles.categoryCard,
                                        pressed && styles.pressedCard
                                    ]}
                                >
                                    <View style={styles.categoryIcon}>
                                        <Text style={styles.categoryEmoji}>📚</Text>
                                    </View>
                                    <Text style={styles.categoryText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2: Question Count Selection */}
                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepNumber}>02</Text>
                            <Text style={styles.stepTitle}>Question Count</Text>
                            <Text style={styles.stepDescription}>How many questions would you like to answer?</Text>
                        </View>
                        
                        <View style={styles.countGrid}>
                            {[5, 10, 20, 30, 50].map((count) => (
                                <Pressable 
                                    key={count}
                                    onPress={() => handleQuestionsCountSelect(count)}
                                    style={({ pressed }) => [
                                        styles.countCard,
                                        pressed && styles.pressedCard
                                    ]}
                                    disabled={loading}
                                >
                                    <Text style={styles.countNumber}>{count}</Text>
                                    <Text style={styles.countLabel}>Questions</Text>
                                </Pressable>
                            ))}
                        </View>
                        
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Preparing your quiz...</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Step 3: Quiz */}
                {(step === 3 && questions.length > 0) && (
                    <QuizComponent questions={questions} setStep={setStep}/>
                )}
            </ScrollView>
        </View>
    )
}

function QuizComponent({ questions = [], setStep }) {
    const [idx, setIdx] = useState(0);
    const [responses, setResponses] = useState(questions.map(q => ({ ...q, selected_option_index: null, is_correct: 0 })));
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const progress = ((idx + 1) / questions.length) * 100;

    function updateOption(chosenOption) {
        setResponses(prev =>
            prev.map((res, i) =>
                i === idx
                    ? {
                          ...res,
                          selected_option_index: chosenOption,
                          is_correct: chosenOption === questions[i].correct_option_index ? 1 : 0,
                      }
                    : res
            )
        );

        // console.log( responses );
    }

    async function calculatePayload() {
        let category = questions[0].category;
        let score = 0;
        let correctAnswers = 0;

        responses.forEach((res, index) => {
            if (res.selected_option_index == res.correctOptionIndex ) {
                score += 1;
                correctAnswers += 1;
            }
        });

        const user = await ReactAsyncStorageAPI.get("user");
        const userEmail = JSON.parse(user).email;

        return {
            category,
            score,
            correctAnswers,
            userEmail,
            responses,
            total_questions: questions.length
        };
    }

    async function submitTest() {
        setLoading(true);
        try {
            const payload = await calculatePayload();
            const response = await API.submit_test(payload);

            if (response.success) {
                setIsSubmitted(true);
            } else {
                alert(response.error);
            }
        } finally {
            setLoading(false);
        }
    }

    if (isSubmitted) {
        const score = responses.filter(r => r.correctOptionIndex === r.selected_option_index ).length;
        const percentage = Math.round((score / questions.length) * 100);
        
        return (
            <View style={styles.resultContainer}>
                <View style={styles.resultCard}>
                    <Text style={styles.resultEmoji}>🎉</Text>
                    <Text style={styles.resultTitle}>Quiz Complete!</Text> 
                    <Text style={styles.resultPercentage}>{percentage}%</Text>
                    <Text style={styles.resultMessage}>
                        {percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
                    </Text>
                    <Pressable
                        style={{
                            backgroundColor: "green",
                            paddingVertical: 12,
                            margin:10,
                            paddingHorizontal: 24,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => {
                            setStep(1); 
                        } }
                    >
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                            Reset
                        </Text>
                    </Pressable>


                </View>
            </View>
        );
    }

    return (
        <View style={styles.quizContainer}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{idx + 1} of {questions.length}</Text>
            </View>

            {/* Question Card */}
            <View style={styles.questionCard}> 
                <Text style={styles.questionText}>{questions[idx].question}</Text>
                
                <View style={styles.optionsContainer}>
                    {questions[idx].options.map((opt, optionIndex) => (
                        <Pressable 
                            key={optionIndex}
                            onPress={() => updateOption(optionIndex)}  
                            style={({ pressed }) => [
                                styles.optionButton,
                                responses[idx].selected_option_index === optionIndex && styles.selectedOption,
                                pressed && styles.pressedOption
                            ]}
                        >
                            <View style={styles.optionContent}>
                                <View style={[
                                    styles.optionIndicator,
                                    responses[idx].selected_option_index === optionIndex && styles.selectedIndicator
                                ]} />
                                <Text style={[
                                    styles.optionText,
                                    responses[idx].selected_option_index === optionIndex && styles.selectedOptionText
                                ]}>
                                    {opt}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Navigation */}
            <View style={styles.navigationContainer}>
                {idx !== 0 && (
                    <Pressable 
                        onPress={() => setIdx(idx - 1)} 
                        style={({ pressed }) => [
                            styles.navButton,
                            styles.prevButton,
                            pressed && styles.pressedNav
                        ]}
                    >
                        <Text style={styles.navButtonText}>← Previous</Text>
                    </Pressable>
                )}
                
                <View style={styles.navSpacer} />
                
                {idx < questions.length - 1 ? (
                    <Pressable 
                        onPress={() => setIdx(idx + 1)} 
                        style={({ pressed }) => [
                            styles.navButton,
                            styles.nextButton,
                            pressed && styles.pressedNav
                        ]}
                    >
                        <Text style={[styles.navButtonText, styles.nextButtonText]}>Next →</Text>
                    </Pressable>
                ) : (
                    <Pressable 
                        onPress={submitTest} 
                        style={({ pressed }) => [
                            styles.navButton,
                            styles.finishButton,
                            pressed && styles.pressedNav
                        ]}
                        disabled={loading}
                    >
                        <Text style={[styles.navButtonText, styles.finishButtonText]}>
                            {loading ? 'Submitting...' : 'Finish Quiz'}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f23',
    },
    header: {
        backgroundColor: '#1a1a2e',
        padding: 10,
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
        fontSize: 18,
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
    stepContainer: {
        flex: 1,
    },
    stepHeader: {
        alignItems: 'center',
        marginBottom: 10,
    },
    stepNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4c6ef5',
        opacity: 0.3,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    stepDescription: {
        fontSize: 16,
        color: '#a0a0a0',
        textAlign: 'center',
        maxWidth: 280,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: (width - 60) / 2,
        backgroundColor: '#1e1e3f',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4a',
    },
    categoryIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#4c6ef5',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    categoryEmoji: {
        fontSize: 24,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
    },
    countGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    countCard: {
        width: 80,
        height: 80,
        backgroundColor: '#1e1e3f',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#2a2a4a',
    },
    countNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4c6ef5',
        marginBottom: 5,
    },
    countLabel: {
        fontSize: 12,
        color: '#a0a0a0',
    },
    pressedCard: {
        transform: [{ scale: 0.95 }],
        opacity: 0.8,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    loadingText: {
        fontSize: 16,
        color: '#4c6ef5',
        fontWeight: '500',
    },
    quizContainer: {
        flex: 1,
    },
    progressContainer: {
        marginBottom: 5,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#2b2b51ff',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#1cad17ff',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#a0a0a0',
        textAlign: 'center',
    },
    questionCard: { 
        borderRadius: 20,
        padding: 5,
        marginBottom: 5, 
    },
    questionNumber: {
        fontSize: 14,
        color: '#4c6ef5',
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ce0000ff',
        lineHeight: 28,
        marginBottom: 15,
    },
    optionsContainer: {
        gap: 8,
    },
    optionButton: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2a2a4a',
        overflow: 'hidden',
    },
    selectedOption: {
        borderColor: '#4c6ef5',
        backgroundColor: '#1a2747',
    },
    pressedOption: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    optionIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2a2a4a',
        marginRight: 15,
        backgroundColor: 'transparent',
    },
    selectedIndicator: {
        backgroundColor: '#4c6ef5',
        borderColor: '#4c6ef5',
    },
    optionText: {
        fontSize: 14,
        color: '#ffffff',
        flex: 1,
        lineHeight: 22,
    },
    selectedOptionText: {
        color: '#ffffff',
        fontWeight: '500',
    },
    navigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    navSpacer: {
        flex: 1,
    },
    navButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    prevButton: {
        backgroundColor: '#2a2a4a',
    },
    nextButton: {
        backgroundColor: '#4c6ef5',
    },
    finishButton: {
        backgroundColor: '#51cf66',
    },
    pressedNav: {
        transform: [{ scale: 0.95 }],
        opacity: 0.8,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    nextButtonText: {
        color: '#ffffff',
    },
    finishButtonText: {
        color: '#ffffff',
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultCard: {
        backgroundColor: '#1e1e3f',
        borderRadius: 20,
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a4a',
        width: '100%',
        maxWidth: 300,
    },
    resultEmoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    resultScore: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4c6ef5',
        marginBottom: 10,
    },
    resultPercentage: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#51cf66',
        marginBottom: 20,
    },
    resultMessage: {
        fontSize: 18,
        color: '#a0a0a0',
        textAlign: 'center',
    },
});

export default Test;