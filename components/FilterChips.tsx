import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ListingType } from '@/types/hawkins';

export type FilterType = 'all' | 'type' | 'character' | 'location' | 'seller';

interface FilterOption {
  type: FilterType;
  value: string;
  label: string;
}

interface FilterChipsProps {
  activeFilter: FilterOption | null;
  onFilterChange: (filter: FilterOption | null) => void;
  characters: string[];
  locations: string[];
  sellers: string[];
}

const TYPE_FILTERS: { value: ListingType; label: string; icon: string }[] = [
  { value: 'sell', label: 'For Sale', icon: '💰' },
  { value: 'swap', label: 'Swap', icon: '⇄' },
  { value: 'iso', label: 'ISO', icon: '🔍' },
];

export default function FilterChips({
  activeFilter,
  onFilterChange,
  characters,
  locations,
  sellers,
}: FilterChipsProps) {
  const { theme } = useTheme();

  const getTypeColor = (type: ListingType): string => {
    switch (type) {
      case 'sell': return theme.colors.primary;
      case 'swap': return theme.colors.swap;
      case 'iso': return theme.colors.iso;
      default: return theme.colors.primary;
    }
  };

  const isActive = (type: FilterType, value?: string) => {
    if (type === 'all') return !activeFilter;
    return activeFilter?.type === type && (value ? activeFilter?.value === value : true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All Listings Chip */}
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: isActive('all')
                ? theme.colors.secondary
                : theme.colors.surface,
              borderColor: theme.colors.secondary,
            },
          ]}
          onPress={() => onFilterChange(null)}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: isActive('all') ? '#fff' : theme.colors.textSecondary,
              },
            ]}
          >
            All Listings
          </Text>
        </TouchableOpacity>

        {/* Type Filters */}
        {TYPE_FILTERS.map((typeFilter) => (
          <TouchableOpacity
            key={typeFilter.value}
            style={[
              styles.chip,
              styles.typeChip,
              {
                backgroundColor: isActive('type', typeFilter.value)
                  ? getTypeColor(typeFilter.value)
                  : theme.colors.surface,
                borderColor: getTypeColor(typeFilter.value),
              },
            ]}
            onPress={() =>
              onFilterChange(
                isActive('type', typeFilter.value)
                  ? null
                  : { type: 'type', value: typeFilter.value, label: typeFilter.label }
              )
            }
          >
            <Text style={styles.typeIcon}>{typeFilter.icon}</Text>
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive('type', typeFilter.value) ? '#fff' : theme.colors.text,
                },
              ]}
            >
              {typeFilter.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Character Filter */}
        <TouchableOpacity
          style={[
            styles.chip,
            styles.groupChip,
            {
              backgroundColor: isActive('character')
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => {
            if (activeFilter?.type === 'character') {
              onFilterChange(null);
            }
          }}
        >
          <Text
            style={[
              styles.chipText,
              { color: isActive('character') ? '#fff' : theme.colors.text },
            ]}
          >
            Character
          </Text>
        </TouchableOpacity>
        {characters.slice(0, 3).map((char) => (
          <TouchableOpacity
            key={`character-${char}`}
            style={[
              styles.chip,
              styles.optionChip,
              {
                backgroundColor: isActive('character', char)
                  ? theme.colors.secondary
                  : 'transparent',
                borderColor: isActive('character', char)
                  ? theme.colors.secondary
                  : theme.colors.border,
              },
            ]}
            onPress={() =>
              onFilterChange(
                isActive('character', char)
                  ? null
                  : { type: 'character', value: char, label: char }
              )
            }
          >
            <Text
              style={[
                styles.chipText,
                styles.optionText,
                { color: isActive('character', char) ? '#fff' : theme.colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {char}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Location Filter */}
        <TouchableOpacity
          style={[
            styles.chip,
            styles.groupChip,
            {
              backgroundColor: isActive('location')
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => {
            if (activeFilter?.type === 'location') {
              onFilterChange(null);
            }
          }}
        >
          <Text
            style={[
              styles.chipText,
              { color: isActive('location') ? '#fff' : theme.colors.text },
            ]}
          >
            Location
          </Text>
        </TouchableOpacity>
        {locations.slice(0, 2).map((loc) => (
          <TouchableOpacity
            key={`location-${loc}`}
            style={[
              styles.chip,
              styles.optionChip,
              {
                backgroundColor: isActive('location', loc)
                  ? theme.colors.secondary
                  : 'transparent',
                borderColor: isActive('location', loc)
                  ? theme.colors.secondary
                  : theme.colors.border,
              },
            ]}
            onPress={() =>
              onFilterChange(
                isActive('location', loc)
                  ? null
                  : { type: 'location', value: loc, label: loc }
              )
            }
          >
            <Text
              style={[
                styles.chipText,
                styles.optionText,
                { color: isActive('location', loc) ? '#fff' : theme.colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {loc}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Seller Filter */}
        <TouchableOpacity
          style={[
            styles.chip,
            styles.groupChip,
            {
              backgroundColor: isActive('seller')
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => {
            if (activeFilter?.type === 'seller') {
              onFilterChange(null);
            }
          }}
        >
          <Text
            style={[
              styles.chipText,
              { color: isActive('seller') ? '#fff' : theme.colors.text },
            ]}
          >
            Seller
          </Text>
        </TouchableOpacity>
        {sellers.slice(0, 2).map((seller) => (
          <TouchableOpacity
            key={`seller-${seller}`}
            style={[
              styles.chip,
              styles.optionChip,
              {
                backgroundColor: isActive('seller', seller)
                  ? theme.colors.secondary
                  : 'transparent',
                borderColor: isActive('seller', seller)
                  ? theme.colors.secondary
                  : theme.colors.border,
              },
            ]}
            onPress={() =>
              onFilterChange(
                isActive('seller', seller)
                  ? null
                  : { type: 'seller', value: seller, label: seller }
              )
            }
          >
            <Text
              style={[
                styles.chipText,
                styles.optionText,
                { color: isActive('seller', seller) ? '#fff' : theme.colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {seller}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeIcon: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 4,
  },
  groupChip: {
    marginLeft: 4,
  },
  optionChip: {
    maxWidth: 100,
  },
  chipText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  optionText: {
    fontSize: 10,
  },
});
