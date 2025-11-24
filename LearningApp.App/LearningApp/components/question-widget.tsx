import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { chipsApi, Question } from '@/services/chipsApi';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;

interface QuestionWidgetProps {
  onSwipe?: (direction: 'left' | 'right') => void;
}

export default function QuestionWidget({ onSwipe }: QuestionWidgetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showSolution, setShowSolution] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateXNext = useRef(new Animated.Value(screenWidth)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Fetch initial question (today's questions)
  const fetchInitialQuestion = async () => {
    try {
      setLoading(true);
      const response = await chipsApi.getQuestions(true);
      if (Array.isArray(response) && response.length > 0) {
        setCurrentQuestion(response[0]);
      } else if ('message' in response) {
        // No questions available today, get a random one
        const randomResponse = await chipsApi.getQuestions(false);
        if (Array.isArray(randomResponse) && randomResponse.length > 0) {
          setCurrentQuestion(randomResponse[0]);
        } else if ('question' in randomResponse && !(randomResponse as any).message) {
          setCurrentQuestion(randomResponse as Question);
        }
      } else if ('question' in response) {
        setCurrentQuestion(response as Question);
      }
      setIsFirstLoad(false);
    } catch (error) {
      console.error('Error fetching initial question:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch random question
  const fetchRandomQuestion = async (): Promise<Question | null> => {
    try {
      const response = await chipsApi.getQuestions(false);
      if (Array.isArray(response) && response.length > 0) {
        return response[0];
      } else if ('question' in response && !(response as any).message) {
        return response as Question;
      }
      return null;
    } catch (error) {
      console.error('Error fetching random question:', error);
      return null;
    }
  };

  // Refresh to get a random question when no questions are available
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const randomQuestion = await fetchRandomQuestion();
      if (randomQuestion) {
        setCurrentQuestion(randomQuestion);
        setShowSolution(false);
        // Preload next question
        const nextQ = await fetchRandomQuestion();
        setNextQuestion(nextQ);
      }
    } catch (error) {
      console.error('Error refreshing questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialQuestion();
  }, []);

  // Preload next question when current question changes
  useEffect(() => {
    if (currentQuestion && !isFirstLoad) {
      fetchRandomQuestion().then(setNextQuestion);
    }
  }, [currentQuestion, isFirstLoad]);

  const resetCardPositions = () => {
    translateX.setValue(0);
    translateXNext.setValue(screenWidth);
    opacity.setValue(1);
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentQuestion) return;

    // Update next date for current question
    try {
      await chipsApi.updateQuestionNextDate(currentQuestion.id);
    } catch (error) {
      console.error('Error updating question next date:', error);
    }

    // Animate current card out
    const toValue = direction === 'right' ? screenWidth : -screenWidth;
    
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateXNext, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Move next question to current
      setCurrentQuestion(nextQuestion);
      setNextQuestion(null);
      setShowSolution(false);
      
      // Reset positions
      resetCardPositions();
      
      // Fetch new next question
      fetchRandomQuestion().then(setNextQuestion);
    });

    onSwipe?.(direction);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
    },
    onPanResponderGrant: () => {
      // Reset the position when gesture starts
    },
    onPanResponderMove: (_, gestureState) => {
      const { dx } = gestureState;
      
      translateX.setValue(dx);
      translateXNext.setValue(screenWidth + dx * 0.5);
      
      // Update opacity based on swipe distance
      const progress = Math.abs(dx) / SWIPE_THRESHOLD;
      opacity.setValue(Math.max(0.3, 1 - progress));
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, vx } = gestureState;
      
      // Determine if swipe is strong enough
      const shouldSwipe = Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > 1.5;
      
      if (shouldSwipe) {
        const direction = dx > 0 ? 'right' : 'left';
        handleSwipe(direction);
      } else {
        // Snap back to center
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(translateXNext, {
            toValue: screenWidth,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#333' : '#fff' }]}>
        <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
          Loading today&apos;s question...
        </Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#333' : '#fff' }]}>
        <Text style={[styles.noQuestionText, { color: isDark ? '#fff' : '#000' }]}>
          No questions available
        </Text>
        <TouchableOpacity 
          onPress={handleRefresh}
          style={[styles.refreshButton, { backgroundColor: isDark ? '#007AFF' : '#007AFF' }]}
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.widgetContainer}>
      {/* Next Question Card (behind) */}
      {nextQuestion && (
        <Animated.View
          style={[
            styles.questionCard,
            {
              backgroundColor: isDark ? '#444' : '#f9f9f9',
              transform: [{ translateX: translateXNext }],
              position: 'absolute',
            },
          ]}
        >
          <Text style={[styles.questionText, { color: isDark ? '#fff' : '#000' }]}>
            {nextQuestion.question}
          </Text>
          <Text style={[styles.hintText, { color: isDark ? '#ccc' : '#666' }]}>
            Swipe for next question
          </Text>
        </Animated.View>
      )}

      {/* Current Question Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.questionCard,
          {
            backgroundColor: isDark ? '#333' : '#fff',
            transform: [{ translateX }],
            opacity,
          },
        ]}
      >
        <Text style={[styles.questionText, { color: isDark ? '#fff' : '#000' }]}>
          {currentQuestion.question}
        </Text>
        
        {showSolution && (
          <View style={styles.solutionContainer}>
            <Text style={[styles.solutionLabel, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              Solution:
            </Text>
            <Text style={[styles.solutionText, { color: isDark ? '#fff' : '#000' }]}>
              {currentQuestion.solution}
            </Text>
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => setShowSolution(!showSolution)}
            style={[styles.solutionButton, { backgroundColor: isDark ? '#4CAF50' : '#2E7D32' }]}
          >
            <Text style={styles.solutionButtonText}>
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.hintText, { color: isDark ? '#ccc' : '#666' }]}>
          {isFirstLoad ? "Today&apos;s question - Swipe to explore more" : "Swipe left or right for next question"}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  widgetContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionCard: {
    width: screenWidth - 40,
    height: 200,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    flex: 1,
  },
  solutionContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  solutionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  solutionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  solutionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  solutionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hintText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noQuestionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});