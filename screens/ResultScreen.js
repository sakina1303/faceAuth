import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';

export default function ResultScreen({ route, navigation }) {
  const { success } = route.params || { success: null };

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset animation
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);

    // Start animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [success]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  if (success === null) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#F5F7FA', '#B8C6DB']}
          style={styles.background}
        />
        <View style={styles.card}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Ready to Verify</Text>
          <Text style={styles.instructions}>
            Please go to the Verify tab to authenticate your face.
          </Text>
        </View>
      </View>
    );
  }

  const gradientColors = success ? ['#D4FC79', '#96E6A1'] : ['#FFAFBD', '#FFC3A0'];
  const icon = success ? '✅' : '🚫';
  const statusText = success ? 'Access Granted' : 'Access Denied';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={success ? ['#E0F7FA', '#F0FFF4'] : ['#FFF5F5', '#FFEBEE']}
        style={styles.background}
      />

      <Animated.View style={[styles.card, animatedStyle, { borderColor: success ? '#2ECC71' : '#E74C3C', borderWidth: 0 }]}>
        <LinearGradient
          colors={gradientColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bigEmoji}>{icon}</Text>
        </LinearGradient>

        <Text style={[styles.statusTitle, { color: '#2C3E50' }]}>
          {statusText}
        </Text>
        <Text style={styles.description}>
          {success
            ? 'Identity verified successfully.'
            : 'Face match failed. Please try again.'}
        </Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Try Again"
          onPress={() => navigation.navigate('Authenticate')}
          type="primary"
          style={{ width: 220, marginBottom: 16 }}
        />
        <CustomButton
          title="Back to Home"
          onPress={() => navigation.navigate('SubmitPicture')}
          type="secondary"
          style={{ width: 220 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 0, // Padding handled by internal views or set to 0 to let gradient fill
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
    marginBottom: 50,
    overflow: 'hidden',
  },
  cardGradient: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginVertical: 10
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  bigEmoji: {
    fontSize: 80,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  instructions: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  }
});
