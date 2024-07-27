import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const getRandomDuration = () => Math.random() * 3000 + 2000; // Random duration between 2000ms and 5000ms
const getRandomDirection = () => (Math.random() > 0.5 ? 1 : -1); // Random direction

const Particles = () => {
  const particles = Array.from({ length: 20 }, () => ({
    cx: useSharedValue(Math.random() * width),
    cy: useSharedValue(Math.random() * height),
    r: Math.random() * 5 + 2,
  }));

  useEffect(() => {
    particles.forEach((particle) => {
      particle.cx.value = withRepeat(
        withTiming(Math.random() * width, { duration: getRandomDuration(), easing: Easing.linear }),
        -1,
        true
      );
      particle.cy.value = withRepeat(
        withTiming(Math.random() * height, { duration: getRandomDuration(), easing: Easing.linear }),
        -1,
        true
      );
    });
  }, []);

  return (
    <Svg height={height} width={width} style={styles.particles}>
      {particles.map((particle, index) => (
        <AnimatedCircle
          key={index}
          cx={particle.cx}
          cy={particle.cy}
          r={particle.r}
          fill="white"
          opacity="0.7"
        />
      ))}
    </Svg>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const GlowButton = ({ colors, text, buttonStyle, textStyle }) => {
  const glowAnimation = useSharedValue(10);
  const gradientPosition1 = useSharedValue(0);
  const gradientPosition2 = useSharedValue(-width);

  useEffect(() => {
    glowAnimation.value = withRepeat(
      withTiming(20, { duration: getRandomDuration(), easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    gradientPosition1.value = withRepeat(
      withTiming(
        width * getRandomDirection(),
        { duration: getRandomDuration(), easing: Easing.inOut(Easing.sin) }
      ),
      -1,
      true
    );

    gradientPosition2.value = withRepeat(
      withTiming(
        width * getRandomDirection(),
        { duration: getRandomDuration(), easing: Easing.inOut(Easing.sin) }
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    textShadowRadius: glowAnimation.value,
  }));

  const gradientStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: gradientPosition1.value }],
  }));

  const gradientStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: gradientPosition2.value }],
  }));

  return (
    <TouchableOpacity style={[styles.button, buttonStyle]}>
      <LinearGradient
        colors={colors}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.fixedGradient}
      />
      <Particles />
      <Animated.View style={[styles.gradientContainer, gradientStyle1]}>
        <LinearGradient
          colors={['transparent', ...colors, 'transparent']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.gradientContainer, gradientStyle2]}>
        <LinearGradient
          colors={['transparent', ...colors, 'transparent']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.Text style={[styles.buttonText, glowStyle, textStyle]}>
        {text}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 60,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textShadowColor: '#00f',
    textShadowOffset: { width: 0, height: 0 },
  },
  fixedGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: '200%',
    height: '100%',
  },
  particles: {
    position: 'absolute',
    zIndex: -1,
  },
});

export default GlowButton;
