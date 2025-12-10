import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Platform,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import {
  OFFICIAL_FIGURES,
  CONDITIONS,
  LOCATIONS,
  ContactMethod,
  Listing,
  ListingType,
  LISTING_TYPES,
  getFigureById,
} from '@/types/hawkins';

interface TradeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<void>;
}

export default function TradeModal({ visible, onClose, onSubmit }: TradeModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [listingType, setListingType] = useState<ListingType>('sell');
  const [selectedFigure, setSelectedFigure] = useState(OFFICIAL_FIGURES[0].id);
  const [swapTargetId, setSwapTargetId] = useState(OFFICIAL_FIGURES[1].id);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<typeof CONDITIONS[number]>('Mint in Box');
  const [location, setLocation] = useState(LOCATIONS[0]);

  // Contact methods
  const [useInstagram, setUseInstagram] = useState(true);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [useTiktok, setUseTiktok] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [useEmail, setUseEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const [showFigureDropdown, setShowFigureDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFigureData = getFigureById(selectedFigure);
  const targetFigureData = getFigureById(swapTargetId);

  const resetForm = () => {
    setListingType('sell');
    setSelectedFigure(OFFICIAL_FIGURES[0].id);
    setSwapTargetId(OFFICIAL_FIGURES[1].id);
    setPrice('');
    setCondition('Mint in Box');
    setLocation(LOCATIONS[0]);
    setInstagramUsername('');
    setTiktokUsername('');
    setEmailAddress('');
    setShowFigureDropdown(false);
    setShowTargetDropdown(false);
    setShowConditionDropdown(false);
    setShowLocationDropdown(false);
  };

  const validateForm = (): boolean => {
    // Price validation for sell and iso types
    if ((listingType === 'sell' || listingType === 'iso') && (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
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

  const getTitle = (): string => {
    const figure = getFigureById(listingType === 'iso' ? selectedFigure : selectedFigure);
    if (!figure) return '';

    switch (listingType) {
      case 'sell':
        return `${figure.id} ${figure.character} - ${figure.name.split(' - ')[1] || 'For Sale'}`;
      case 'swap':
        const target = getFigureById(swapTargetId);
        return `${figure.id} ${figure.character} ⇄ ${target?.character || 'Trade'}`;
      case 'iso':
        return `ISO: ${figure.id} ${figure.character}`;
      default:
        return figure.name;
    }
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
        title: getTitle(),
        price: listingType === 'swap' ? 0 : parseFloat(price),
        condition,
        location,
        description: '',
        imageUri: '',
        sellerId: 'current_user',
        sellerHandle: '@CurrentUser',
        contactMethods,
        isSold: false,
        listingType,
        swapTargetId: listingType === 'swap' ? swapTargetId : undefined,
      });

      resetForm();
      onClose();
      Alert.alert('Success!', `Your ${listingType === 'iso' ? 'request' : 'listing'} has been posted!`);
    } catch {
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDropdown = (
    items: { label: string; value: string }[],
    selectedValue: string,
    onSelect: (value: string) => void,
    onClose: () => void
  ) => (
    <View style={[styles.dropdown, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.dropdownItem,
              selectedValue === item.value && { backgroundColor: theme.colors.primary + '30' },
            ]}
            onPress={() => {
              onSelect(item.value);
              onClose();
            }}
          >
            <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const figureOptions = OFFICIAL_FIGURES.map((f) => ({ label: `${f.id} - ${f.character}`, value: f.id }));
  const conditionOptions = CONDITIONS.map((c) => ({ label: c, value: c }));
  const locationOptions = LOCATIONS.map((l) => ({ label: l, value: l }));

  const getTypeColor = (type: ListingType): string => {
    switch (type) {
      case 'sell': return theme.colors.primary;
      case 'swap': return theme.colors.swap;
      case 'iso': return theme.colors.iso;
      default: return theme.colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>TRADE CENTER</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            {LISTING_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: listingType === type.value ? getTypeColor(type.value) : theme.colors.surface,
                    borderColor: getTypeColor(type.value),
                  },
                ]}
                onPress={() => setListingType(type.value)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    { color: listingType === type.value ? '#fff' : theme.colors.text },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* I Have / I Want Label */}
          <Text style={[styles.sectionLabel, { color: getTypeColor(listingType) }]}>
            {listingType === 'iso' ? '🔍 I WANT' : '📦 I HAVE'}
          </Text>

          {/* Figure Selector */}
          <View style={[styles.field, { zIndex: 100 }]}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {listingType === 'iso' ? 'Looking For' : 'Figure'}
            </Text>
            <TouchableOpacity
              style={[styles.input, styles.selectInput, { borderBottomColor: getTypeColor(listingType) }]}
              onPress={() => {
                setShowFigureDropdown(!showFigureDropdown);
                setShowTargetDropdown(false);
                setShowConditionDropdown(false);
                setShowLocationDropdown(false);
              }}
            >
              <Text style={[styles.inputText, { color: theme.colors.text }]}>
                {selectedFigure} - {selectedFigureData?.character}
              </Text>
              <Text style={[styles.chevron, { color: getTypeColor(listingType) }]}>▼</Text>
            </TouchableOpacity>
            {showFigureDropdown && renderDropdown(
              figureOptions,
              selectedFigure,
              setSelectedFigure,
              () => setShowFigureDropdown(false)
            )}
          </View>

          {/* Swap Target (only for swap) */}
          {listingType === 'swap' && (
            <>
              <Text style={[styles.sectionLabel, { color: theme.colors.swap }]}>
                🎯 I WANT
              </Text>
              <View style={[styles.field, { zIndex: 90 }]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Swap For</Text>
                <TouchableOpacity
                  style={[styles.input, styles.selectInput, { borderBottomColor: theme.colors.swap }]}
                  onPress={() => {
                    setShowTargetDropdown(!showTargetDropdown);
                    setShowFigureDropdown(false);
                    setShowConditionDropdown(false);
                    setShowLocationDropdown(false);
                  }}
                >
                  <Text style={[styles.inputText, { color: theme.colors.text }]}>
                    {swapTargetId} - {targetFigureData?.character}
                  </Text>
                  <Text style={[styles.chevron, { color: theme.colors.swap }]}>▼</Text>
                </TouchableOpacity>
                {showTargetDropdown && renderDropdown(
                  figureOptions.filter((f) => f.value !== selectedFigure),
                  swapTargetId,
                  setSwapTargetId,
                  () => setShowTargetDropdown(false)
                )}
              </View>
            </>
          )}

          {/* Price (hidden for swap) */}
          {listingType !== 'swap' && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                {listingType === 'iso' ? 'Max Price' : 'Price'}
              </Text>
              <TextInput
                style={[styles.input, { color: theme.colors.text, borderBottomColor: getTypeColor(listingType) }]}
                value={price}
                onChangeText={setPrice}
                placeholder={listingType === 'iso' ? 'Max budget...' : '$0.00'}
                placeholderTextColor={theme.colors.textSecondary + '80'}
                keyboardType="decimal-pad"
              />
            </View>
          )}

          {/* Condition */}
          <View style={[styles.field, { zIndex: 80 }]}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {listingType === 'iso' ? 'Minimum Condition' : 'Condition'}
            </Text>
            <TouchableOpacity
              style={[styles.input, styles.selectInput, { borderBottomColor: getTypeColor(listingType) }]}
              onPress={() => {
                setShowConditionDropdown(!showConditionDropdown);
                setShowFigureDropdown(false);
                setShowTargetDropdown(false);
                setShowLocationDropdown(false);
              }}
            >
              <Text style={[styles.inputText, { color: theme.colors.text }]}>{condition}</Text>
              <Text style={[styles.chevron, { color: getTypeColor(listingType) }]}>▼</Text>
            </TouchableOpacity>
            {showConditionDropdown && renderDropdown(
              conditionOptions,
              condition,
              (val) => setCondition(val as typeof CONDITIONS[number]),
              () => setShowConditionDropdown(false)
            )}
          </View>

          {/* Location */}
          <View style={[styles.field, { zIndex: 70 }]}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Location</Text>
            <TouchableOpacity
              style={[styles.input, styles.selectInput, { borderBottomColor: getTypeColor(listingType) }]}
              onPress={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowFigureDropdown(false);
                setShowTargetDropdown(false);
                setShowConditionDropdown(false);
              }}
            >
              <Text style={[styles.inputText, { color: theme.colors.text }]}>{location}</Text>
              <Text style={[styles.chevron, { color: getTypeColor(listingType) }]}>▼</Text>
            </TouchableOpacity>
            {showLocationDropdown && renderDropdown(
              locationOptions,
              location,
              setLocation,
              () => setShowLocationDropdown(false)
            )}
          </View>

          {/* Contact Methods */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Contact Method</Text>

            <View style={styles.contactRow}>
              <Switch
                value={useInstagram}
                onValueChange={setUseInstagram}
                trackColor={{ false: theme.colors.surface, true: getTypeColor(listingType) }}
                thumbColor={useInstagram ? '#fff' : theme.colors.textSecondary}
              />
              <Text style={[styles.contactLabel, { color: theme.colors.text }]}>📷 Instagram</Text>
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

            <View style={styles.contactRow}>
              <Switch
                value={useTiktok}
                onValueChange={setUseTiktok}
                trackColor={{ false: theme.colors.surface, true: getTypeColor(listingType) }}
                thumbColor={useTiktok ? '#fff' : theme.colors.textSecondary}
              />
              <Text style={[styles.contactLabel, { color: theme.colors.text }]}>🎵 TikTok</Text>
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

            <View style={styles.contactRow}>
              <Switch
                value={useEmail}
                onValueChange={setUseEmail}
                trackColor={{ false: theme.colors.surface, true: getTypeColor(listingType) }}
                thumbColor={useEmail ? '#fff' : theme.colors.textSecondary}
              />
              <Text style={[styles.contactLabel, { color: theme.colors.text }]}>✉️ Email</Text>
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

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: getTypeColor(listingType) },
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? 'POSTING...'
                : listingType === 'sell'
                ? 'POST FOR SALE'
                : listingType === 'swap'
                ? 'POST SWAP'
                : 'POST REQUEST'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 60,
  },
  closeText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 21, 21, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    gap: 4,
  },
  typeIcon: {
    fontSize: 20,
  },
  typeLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  field: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 11,
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
    fontSize: 13,
    width: 90,
  },
  contactInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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
