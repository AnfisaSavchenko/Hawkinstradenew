import React, { useCallback } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import HawkinsHeader from '@/components/HawkinsHeader';
import SellForm from '@/components/SellForm';
import { addListing } from '@/services/dataService';
import { Listing } from '@/types/hawkins';

export default function SellScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleImageSelect = useCallback(async (): Promise<string | null> => {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'We need camera roll permissions to select images.'
          );
          return null;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
      return null;
    }
  }, []);

  const handleSubmit = useCallback(
    async (listing: Omit<Listing, 'id' | 'createdAt'>) => {
      try {
        await addListing(listing);
        // Navigate to Market tab to see the new listing
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Failed to add listing:', error);
        throw error;
      }
    },
    [router]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HawkinsHeader />
      <SellForm onSubmit={handleSubmit} onImageSelect={handleImageSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
