import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { OFFICIAL_FIGURES, CONDITIONS, LOCATIONS, ContactMethod, Listing } from '@/types/hawkins';

interface SellFormProps {
  onSubmit: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<void>;
  onImageSelect: () => Promise<string | null>;
}

export default function SellForm({ onSubmit, onImageSelect }: SellFormProps) {
  const { theme } = useTheme();

  const [selectedFigure, setSelectedFigure] = useState(OFFICIAL_FIGURES[0].id);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<typeof CONDITIONS[number]>('Mint in Box');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Contact methods
  const [useInstagram, setUseInstagram] = useState(true);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [useTiktok, setUseTiktok] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [useEmail, setUseEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const [showFigureDropdown, setShowFigureDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFigureData = OFFICIAL_FIGURES.find((f) => f.id === selectedFigure);

  const handleImageSelect = async () => {
    const uri = await onImageSelect();
    if (uri) {
      setImageUri(uri);
    }
  };

  const validateForm = (): boolean => {
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return false;
    }

    const contactMethods: ContactMethod[] = [];
    if (useInstagram && instagramUsername) {
      contactMethods.push({ type: 'instagram', username: instagramUsername });
    }
    if (useTiktok && tiktokUsername) {
      contactMethods.push({ type: 'tiktok', username: tiktokUsername });
    }
    if (useEmail && emailAddress) {
      contactMethods.push({ type: 'email', username: emailAddress });
    }

    if (contactMethods.length === 0) {
      Alert.alert('Contact Required', 'Please add at least one contact method.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const contactMethods: ContactMethod[] = [];
    if (useInstagram && instagramUsername) {
      contactMethods.push({ type: 'instagram', username: instagramUsername });
    }
    if (useTiktok && tiktokUsername) {
      contactMethods.push({ type: 'tiktok', username: tiktokUsername });
    }
    if (useEmail && emailAddress) {
      contactMethods.push({ type: 'email', username: emailAddress });
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        figureId: selectedFigure,
        title: `${selectedFigure} ${selectedFigureData?.character || ''} - ${selectedFigureData?.name.split(' - ')[1] || ''}`,
        price: parseFloat(price),
        condition,
        location,
        description: description || `${selectedFigureData?.name} figure in ${condition} condition.`,
        imageUri: imageUri || `https://picsum.photos/seed/${selectedFigure}/400/500`,
        sellerId: 'current_user',
        sellerHandle: '@CurrentUser',
        contactMethods,
        isSold: false,
      });

      // Reset form
      setPrice('');
      setDescription('');
      setImageUri(null);
      Alert.alert('Success!', 'Your listing has been posted to the marketplace.');
    } catch {
      Alert.alert('Error', 'Failed to post listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDropdown = (
    items: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
    onClose: () => void
  ) => (
    <View style={[styles.dropdown, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.dropdownItem,
              selectedValue === item && { backgroundColor: theme.colors.primary + '30' },
            ]}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Title */}
      <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
        SELL FIGURE
      </Text>

      {/* Character Dropdown */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Character</Text>
        <TouchableOpacity
          style={[styles.input, styles.selectInput, { borderBottomColor: theme.colors.primary }]}
          onPress={() => setShowFigureDropdown(!showFigureDropdown)}
        >
          <Text style={[styles.inputText, { color: theme.colors.text }]}>
            {selectedFigure} {selectedFigureData?.character}
          </Text>
          <Text style={[styles.chevron, { color: theme.colors.primary }]}>▼</Text>
        </TouchableOpacity>
        {showFigureDropdown && renderDropdown(
          OFFICIAL_FIGURES.map((f) => `${f.id} ${f.character}`),
          `${selectedFigure} ${selectedFigureData?.character}`,
          (val) => setSelectedFigure(val.split(' ')[0]),
          () => setShowFigureDropdown(false)
        )}
      </View>

      {/* Price */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Price</Text>
        <TextInput
          style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.primary }]}
          value={price}
          onChangeText={setPrice}
          placeholder="$0.00"
          placeholderTextColor={theme.colors.textSecondary + '80'}
          keyboardType="decimal-pad"
        />
      </View>

      {/* Condition Dropdown */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Condition</Text>
        <TouchableOpacity
          style={[styles.input, styles.selectInput, { borderBottomColor: theme.colors.primary }]}
          onPress={() => setShowConditionDropdown(!showConditionDropdown)}
        >
          <Text style={[styles.inputText, { color: theme.colors.text }]}>{condition}</Text>
          <Text style={[styles.chevron, { color: theme.colors.primary }]}>▼</Text>
        </TouchableOpacity>
        {showConditionDropdown && renderDropdown(
          [...CONDITIONS],
          condition,
          (val) => setCondition(val as typeof CONDITIONS[number]),
          () => setShowConditionDropdown(false)
        )}
      </View>

      {/* Location Dropdown */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Location</Text>
        <TouchableOpacity
          style={[styles.input, styles.selectInput, { borderBottomColor: theme.colors.primary }]}
          onPress={() => setShowLocationDropdown(!showLocationDropdown)}
        >
          <Text style={[styles.inputText, { color: theme.colors.text }]}>{location}</Text>
          <Text style={[styles.chevron, { color: theme.colors.primary }]}>▼</Text>
        </TouchableOpacity>
        {showLocationDropdown && renderDropdown(
          LOCATIONS,
          location,
          setLocation,
          () => setShowLocationDropdown(false)
        )}
      </View>

      {/* Contact Methods */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Contact Method</Text>

        {/* Instagram */}
        <View style={styles.contactRow}>
          <Switch
            value={useInstagram}
            onValueChange={setUseInstagram}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={useInstagram ? '#fff' : theme.colors.textSecondary}
          />
          <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Instagram</Text>
          {useInstagram && (
            <TextInput
              style={[styles.contactInput, { color: theme.colors.text, borderBottomColor: theme.colors.secondary }]}
              value={instagramUsername}
              onChangeText={setInstagramUsername}
              placeholder="@username"
              placeholderTextColor={theme.colors.textSecondary + '80'}
            />
          )}
        </View>

        {/* TikTok */}
        <View style={styles.contactRow}>
          <Switch
            value={useTiktok}
            onValueChange={setUseTiktok}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={useTiktok ? '#fff' : theme.colors.textSecondary}
          />
          <Text style={[styles.contactLabel, { color: theme.colors.text }]}>TikTok</Text>
          {useTiktok && (
            <TextInput
              style={[styles.contactInput, { color: theme.colors.text, borderBottomColor: theme.colors.secondary }]}
              value={tiktokUsername}
              onChangeText={setTiktokUsername}
              placeholder="@username"
              placeholderTextColor={theme.colors.textSecondary + '80'}
            />
          )}
        </View>

        {/* Email */}
        <View style={styles.contactRow}>
          <Switch
            value={useEmail}
            onValueChange={setUseEmail}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={useEmail ? '#fff' : theme.colors.textSecondary}
          />
          <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Email</Text>
          {useEmail && (
            <TextInput
              style={[styles.contactInput, { color: theme.colors.text, borderBottomColor: theme.colors.secondary }]}
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder="email@example.com"
              placeholderTextColor={theme.colors.textSecondary + '80'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        </View>
      </View>

      {/* Image Upload */}
      <View style={styles.field}>
        <TouchableOpacity
          style={[styles.uploadButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
          onPress={handleImageSelect}
        >
          <Text style={[styles.uploadIcon, { color: theme.colors.textSecondary }]}>📷</Text>
          <Text style={[styles.uploadText, { color: theme.colors.text }]}>
            {imageUri ? 'Photo Selected' : 'Upload Photo of Figure'}
          </Text>
          <Text style={[styles.uploadSubtext, { color: theme.colors.textSecondary }]}>
            Take Photo / Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: theme.colors.secondary },
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'POSTING...' : 'POST LISTING'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(255, 21, 21, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  field: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    fontFamily: 'monospace',
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontFamily: 'monospace',
    fontSize: 16,
  },
  chevron: {
    fontSize: 12,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dropdownItemText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactLabel: {
    fontFamily: 'monospace',
    fontSize: 14,
    width: 80,
  },
  contactInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  uploadButton: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontFamily: 'monospace',
    fontSize: 11,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
