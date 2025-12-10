import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Listing } from '@/types/hawkins';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ItemDetailsModalProps {
  listing: Listing;
  moreBySeller: Listing[];
  isOwner: boolean;
  onClose: () => void;
  onMarkAsSold: () => void;
  onDelete: () => void;
  onSellerPress: (handle: string) => void;
  onRelatedItemPress: (listing: Listing) => void;
}

export default function ItemDetailsModal({
  listing,
  moreBySeller,
  isOwner,
  onClose,
  onMarkAsSold,
  onDelete,
  onSellerPress,
  onRelatedItemPress,
}: ItemDetailsModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    const message = `🔥 Check out this Stranger Things collectible!\n\n${listing.title}\n💰 $${listing.price.toFixed(2)}\n📍 ${listing.location}\n📦 Condition: ${listing.condition}\n\nContact: ${listing.sellerHandle}\n\n#HawkinsTrade #StrangerThings #Collectibles`;

    try {
      await Share.share({
        message,
        title: listing.title,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleContact = (method: typeof listing.contactMethods[0]) => {
    let message = '';
    switch (method.type) {
      case 'instagram':
        message = `Open Instagram and search for ${method.username}`;
        break;
      case 'tiktok':
        message = `Open TikTok and search for ${method.username}`;
        break;
      case 'email':
        message = `Send an email to ${method.username}`;
        break;
    }
    Alert.alert('Contact Seller', message);
  };

  const handleMarkAsSold = () => {
    Alert.alert(
      'Mark as Sold',
      'Are you sure you want to mark this listing as sold?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark Sold', style: 'destructive', onPress: onMarkAsSold },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      case 'email':
        return '✉️';
      default:
        return '💬';
    }
  };

  const getContactLabel = (type: string) => {
    switch (type) {
      case 'instagram':
        return 'Instagram';
      case 'tiktok':
        return 'TikTok';
      case 'email':
        return 'Email';
      default:
        return 'Contact';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Close Button */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 8 }]}
        onPress={onClose}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: listing.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          {listing.isSold && (
            <View style={styles.soldOverlay}>
              <View style={[styles.soldStamp, { borderColor: theme.colors.sold }]}>
                <Text style={[styles.soldText, { color: theme.colors.sold }]}>SOLD</Text>
              </View>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {listing.title}
          </Text>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            ${listing.price.toFixed(2)}
          </Text>

          {/* Seller */}
          <TouchableOpacity
            style={styles.sellerRow}
            onPress={() => onSellerPress(listing.sellerHandle)}
          >
            <Text style={[styles.sellerLabel, { color: theme.colors.textSecondary }]}>
              Seller:
            </Text>
            <Text style={[styles.sellerHandle, { color: theme.colors.secondary }]}>
              {listing.sellerHandle}
            </Text>
          </TouchableOpacity>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            {listing.contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactButton,
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => handleContact(method)}
              >
                <Text style={styles.contactIcon}>{getContactIcon(method.type)}</Text>
                <Text style={[styles.contactButtonText, { color: theme.colors.text }]}>
                  {getContactLabel(method.type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Details */}
          <View style={[styles.detailsCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Condition</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{listing.condition}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Location</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{listing.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Figure ID</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{listing.figureId}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {listing.description}
          </Text>

          {/* Owner Actions */}
          {isOwner && !listing.isSold && (
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={[styles.ownerButton, { backgroundColor: theme.colors.success }]}
                onPress={handleMarkAsSold}
              >
                <Text style={styles.ownerButtonText}>Mark as Sold</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ownerButton, { backgroundColor: theme.colors.sold }]}
                onPress={handleDelete}
              >
                <Text style={styles.ownerButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Share Button */}
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.colors.secondary }]}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>SHARE LISTING</Text>
          </TouchableOpacity>

          {/* More from Seller */}
          {moreBySeller.length > 0 && (
            <View style={styles.moreBySeller}>
              <Text style={[styles.moreBySellerTitle, { color: theme.colors.text }]}>
                More from {listing.sellerHandle}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moreBySellerScroll}
              >
                {moreBySeller.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.relatedCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                    onPress={() => onRelatedItemPress(item)}
                  >
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.relatedInfo}>
                      <Text
                        style={[styles.relatedId, { color: theme.colors.textSecondary }]}
                        numberOfLines={1}
                      >
                        {item.figureId}
                      </Text>
                      <Text
                        style={[styles.relatedTitle, { color: theme.colors.text }]}
                        numberOfLines={1}
                      >
                        {item.title.split(' ')[1]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldStamp: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderWidth: 6,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    backgroundColor: 'rgba(30, 7, 7, 0.9)',
  },
  soldText: {
    fontFamily: 'serif',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sellerLabel: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  sellerHandle: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  contactIcon: {
    fontSize: 16,
  },
  contactButtonText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontFamily: 'serif',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  ownerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  ownerButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shareButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  shareButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  moreBySeller: {
    marginTop: 8,
  },
  moreBySellerTitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  moreBySellerScroll: {
    gap: 12,
  },
  relatedCard: {
    width: 120,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#1a1a1a',
  },
  relatedInfo: {
    padding: 8,
  },
  relatedId: {
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 2,
  },
  relatedTitle: {
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: '600',
  },
});
