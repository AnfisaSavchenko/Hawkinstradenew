import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_PARTICLES = 30;

interface Particle {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
}

function SporeParticle({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [particle.delay, particle.duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [particle.startY, particle.startY - SCREEN_HEIGHT * 0.6]
    );
    const translateX = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [
        particle.startX,
        particle.startX + particle.driftX,
        particle.startX,
        particle.startX - particle.driftX,
        particle.startX,
      ]
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.1, 0.7, 1],
      [0, particle.opacity, particle.opacity, 0]
    );
    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.5, 1, 0.8]
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function SporeOverlay() {
  const { isUpsideDown } = useTheme();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      id: i,
      startX: Math.random() * SCREEN_WIDTH,
      startY: SCREEN_HEIGHT + Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 8000 + Math.random() * 6000,
      delay: Math.random() * 4000,
      opacity: 0.15 + Math.random() * 0.25,
      driftX: 15 + Math.random() * 30,
    }));
  }, []);

  if (!isUpsideDown) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <SporeParticle key={particle.id} particle={particle} />
      ))}
      {/* Vignette overlay */}
      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#b0c4de',
    ...Platform.select({
      ios: {
        shadowColor: '#b0c4de',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: SCREEN_WIDTH / 3,
    borderColor: 'rgba(9, 20, 40, 0.3)',
    borderRadius: SCREEN_WIDTH,
    transform: [{ scale: 2 }],
  },
});
