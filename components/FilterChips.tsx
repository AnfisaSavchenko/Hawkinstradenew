import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ListingType, OFFICIAL_FIGURES, Figure } from '@/types/hawkins';

export type FilterType = 'all' | 'type' | 'character' | 'country';

interface FilterOption {
  type: FilterType;
  value: string;
  label: string;
}

interface FilterChipsProps {
  activeFilter: FilterOption | null;
  onFilterChange: (filter: FilterOption | null) => void;
  characters: string[];
  countries: string[];
}

const TYPE_FILTERS: { value: ListingType; label: string; icon: string }[] = [
  { value: 'sell', label: 'Sell', icon: '💰' },
  { value: 'swap', label: 'Swap', icon: '⇄' },
  { value: 'iso', label: 'ISO', icon: '🔍' },
];

export default function FilterChips({
  activeFilter,
  onFilterChange,
  characters,
  countries,
}: FilterChipsProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const getTypeColor = (type: ListingType): string => {
    switch (type) {
      case 'sell': return theme.colors.primary;
      case 'swap': return theme.colors.swap;
      case 'iso': return theme.colors.iso;
      default: return theme.colors.primary;
    }
  };

  const isTypeActive = (type: ListingType) => {
    return activeFilter?.type === 'type' && activeFilter?.value === type;
  };

  const handleTypeToggle = (type: ListingType) => {
    if (isTypeActive(type)) {
      onFilterChange(null);
    } else {
      onFilterChange({
        type: 'type',
        value: type,
        label: TYPE_FILTERS.find((t) => t.value === type)?.label || type,
      });
    }
  };

  const handleCharacterSelect = (character: string) => {
    setShowCharacterModal(false);
    if (activeFilter?.type === 'character' && activeFilter?.value === character) {
      onFilterChange(null);
    } else {
      onFilterChange({
        type: 'character',
        value: character,
        label: character,
      });
    }
  };

  const handleCountrySelect = (country: string) => {
    setShowCountryModal(false);
    if (activeFilter?.type === 'country' && activeFilter?.value === country) {
      onFilterChange(null);
    } else {
      onFilterChange({
        type: 'country',
        value: country,
        label: country,
      });
    }
  };

  const clearFilters = () => {
    onFilterChange(null);
    setShowCharacterModal(false);
    setShowCountryModal(false);
  };

  // Get unique figures for character selection
  const getUniqueFigures = (): Figure[] => {
    const seen = new Set<string>();
    return OFFICIAL_FIGURES.filter((f) => {
      if (characters.includes(f.character) && !seen.has(f.character)) {
        seen.add(f.character);
        return true;
      }
      return false;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Type Toggle Row */}
      <View style={styles.typeRow}>
        {TYPE_FILTERS.map((typeFilter) => (
          <TouchableOpacity
            key={typeFilter.value}
            style={[
              styles.typeButton,
              {
                backgroundColor: isTypeActive(typeFilter.value)
                  ? getTypeColor(typeFilter.value)
                  : theme.colors.surface,
                borderColor: getTypeColor(typeFilter.value),
              },
            ]}
            onPress={() => handleTypeToggle(typeFilter.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.typeIcon}>{typeFilter.icon}</Text>
            <Text
              style={[
                styles.typeLabel,
                { color: isTypeActive(typeFilter.value) ? '#fff' : theme.colors.text },
              ]}
            >
              {typeFilter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dropdown Buttons Row */}
      <View style={styles.dropdownRow}>
        {/* Character Dropdown */}
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            {
              backgroundColor: activeFilter?.type === 'character'
                ? theme.colors.secondary
                : theme.colors.surface,
              borderColor: activeFilter?.type === 'character'
                ? theme.colors.secondary
                : theme.colors.border,
            },
          ]}
          onPress={() => setShowCharacterModal(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dropdownLabel,
              { color: activeFilter?.type === 'character' ? '#fff' : theme.colors.text },
            ]}
            numberOfLines={1}
          >
            {activeFilter?.type === 'character' ? activeFilter.value : 'Character'}
          </Text>
          <Text
            style={[
              styles.dropdownChevron,
              { color: activeFilter?.type === 'character' ? '#fff' : theme.colors.textSecondary },
            ]}
          >
            ▾
          </Text>
        </TouchableOpacity>

        {/* Country Dropdown */}
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            {
              backgroundColor: activeFilter?.type === 'country'
                ? theme.colors.secondary
                : theme.colors.surface,
              borderColor: activeFilter?.type === 'country'
                ? theme.colors.secondary
                : theme.colors.border,
            },
          ]}
          onPress={() => setShowCountryModal(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dropdownLabel,
              { color: activeFilter?.type === 'country' ? '#fff' : theme.colors.text },
            ]}
            numberOfLines={1}
          >
            {activeFilter?.type === 'country' ? activeFilter.value : 'Country'}
          </Text>
          <Text
            style={[
              styles.dropdownChevron,
              { color: activeFilter?.type === 'country' ? '#fff' : theme.colors.textSecondary },
            ]}
          >
            ▾
          </Text>
        </TouchableOpacity>

        {/* Clear Filter Button */}
        {activeFilter && (
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: theme.colors.border }]}
            onPress={clearFilters}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearIcon, { color: theme.colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Character Modal */}
      <Modal
        visible={showCharacterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCharacterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                paddingBottom: insets.bottom + 16,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>SELECT CHARACTER</Text>
              <TouchableOpacity onPress={() => setShowCharacterModal(false)}>
                <Text style={[styles.modalClose, { color: theme.colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* All Characters Option */}
            <TouchableOpacity
              style={[
                styles.modalOption,
                {
                  backgroundColor: !activeFilter || activeFilter.type !== 'character'
                    ? theme.colors.secondary + '30'
                    : 'transparent',
                  borderBottomColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                setShowCharacterModal(false);
                onFilterChange(null);
              }}
            >
              <Text style={[styles.modalOptionIcon]}>👥</Text>
              <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>All Characters</Text>
            </TouchableOpacity>

            {/* Character List */}
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {getUniqueFigures().map((figure) => (
                <TouchableOpacity
                  key={figure.id}
                  style={[
                    styles.modalOptionWithImage,
                    {
                      backgroundColor: activeFilter?.type === 'character' && activeFilter?.value === figure.character
                        ? theme.colors.secondary + '30'
                        : 'transparent',
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => handleCharacterSelect(figure.character)}
                >
                  <Image source={figure.image} style={styles.modalThumb} resizeMode="cover" />
                  <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>
                    {figure.character}
                  </Text>
                  {activeFilter?.type === 'character' && activeFilter?.value === figure.character && (
                    <Text style={[styles.checkmark, { color: theme.colors.secondary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Country Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                paddingBottom: insets.bottom + 16,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>SELECT COUNTRY</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Text style={[styles.modalClose, { color: theme.colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* All Countries Option */}
            <TouchableOpacity
              style={[
                styles.modalOption,
                {
                  backgroundColor: !activeFilter || activeFilter.type !== 'country'
                    ? theme.colors.secondary + '30'
                    : 'transparent',
                  borderBottomColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                setShowCountryModal(false);
                onFilterChange(null);
              }}
            >
              <Text style={[styles.modalOptionIcon]}>🌍</Text>
              <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>All Countries</Text>
            </TouchableOpacity>

            {/* Country List */}
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.modalOption,
                    {
                      backgroundColor: activeFilter?.type === 'country' && activeFilter?.value === country
                        ? theme.colors.secondary + '30'
                        : 'transparent',
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Text style={[styles.modalOptionIcon]}>📍</Text>
                  <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>
                    {country}
                  </Text>
                  {activeFilter?.type === 'country' && activeFilter?.value === country && (
                    <Text style={[styles.checkmark, { color: theme.colors.secondary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    gap: 6,
  },
  typeIcon: {
    fontSize: 14,
  },
  typeLabel: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  dropdownChevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  clearButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  clearIcon: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  modalClose: {
    fontSize: 20,
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  modalOptionWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  modalThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  modalOptionIcon: {
    fontSize: 24,
  },
  modalOptionText: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
