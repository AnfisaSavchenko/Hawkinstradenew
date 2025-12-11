import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export default function HawkinsHeader() {
  const { theme, toggleTheme, isUpsideDown } = useTheme();
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);
  const toggleRotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isUpsideDown ? 180 : 0, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    toggleRotation.value = withTiming(isUpsideDown ? 360 : 0, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isUpsideDown, rotation, toggleRotation]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${toggleRotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>HAWKINS</Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>TRADE</Text>
        </Animated.View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.toggleButton, { borderColor: theme.colors.border }]}
          activeOpacity={0.7}
        >
          <Animated.Text style={[styles.toggleIcon, toggleAnimatedStyle]}>
            🌀
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 21, 21, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 8,
    marginTop: -4,
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  toggleIcon: {
    fontSize: 24,
  },
});
