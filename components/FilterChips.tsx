import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type FilterType = 'all' | 'character' | 'location' | 'seller' | 'condition';

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

export default function FilterChips({
  activeFilter,
  onFilterChange,
  characters,
  locations,
  sellers,
}: FilterChipsProps) {
  const { theme } = useTheme();

  const filterGroups: { type: FilterType; label: string; options: string[] }[] = [
    { type: 'character', label: 'Character', options: characters },
    { type: 'location', label: 'Location', options: locations },
    { type: 'seller', label: 'Seller', options: sellers },
  ];

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
        {/* All Figures Chip */}
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
            All Figures
          </Text>
        </TouchableOpacity>

        {/* Filter Groups */}
        {filterGroups.map((group) => (
          <React.Fragment key={group.type}>
            {/* Group Header Chip */}
            <TouchableOpacity
              style={[
                styles.chip,
                styles.groupChip,
                {
                  backgroundColor: isActive(group.type)
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                // If clicking the group header and there's an active filter of this type, clear it
                if (activeFilter?.type === group.type) {
                  onFilterChange(null);
                }
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive(group.type) ? '#fff' : theme.colors.text,
                  },
                ]}
              >
                {group.label}
              </Text>
            </TouchableOpacity>

            {/* Individual Options (shown inline) */}
            {group.options.slice(0, 3).map((option) => (
              <TouchableOpacity
                key={`${group.type}-${option}`}
                style={[
                  styles.chip,
                  styles.optionChip,
                  {
                    backgroundColor: isActive(group.type, option)
                      ? theme.colors.secondary
                      : 'transparent',
                    borderColor: isActive(group.type, option)
                      ? theme.colors.secondary
                      : theme.colors.border,
                  },
                ]}
                onPress={() =>
                  onFilterChange(
                    isActive(group.type, option)
                      ? null
                      : { type: group.type, value: option, label: option }
                  )
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    styles.optionText,
                    {
                      color: isActive(group.type, option)
                        ? '#fff'
                        : theme.colors.textSecondary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </React.Fragment>
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
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  groupChip: {
    marginLeft: 8,
  },
  optionChip: {
    maxWidth: 120,
  },
  chipText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
  },
  optionText: {
    fontSize: 11,
  },
});
