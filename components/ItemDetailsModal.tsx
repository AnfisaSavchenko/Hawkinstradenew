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
import { Listing, getFigureById, getFigureImage } from '@/types/hawkins';

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

  const figure = getFigureById(listing.figureId);
  const figureImage = getFigureImage(listing.figureId);
  const targetFigure = listing.swapTargetId ? getFigureById(listing.swapTargetId) : null;

  const isIso = listing.listingType === 'iso';
  const isSwap = listing.listingType === 'swap';

  // Use user-uploaded photo if available, otherwise fall back to stock figure image
  const heroImage = listing.userImageUri ? { uri: listing.userImageUri } : figureImage;

  // Filter out the current listing from "More from Seller"
  const filteredMoreBySeller = moreBySeller.filter((item) => item.id !== listing.id);

  // Helper to get the display image for a listing (user photo or fallback to figure)
  const getListingImage = (item: Listing) => {
    return item.userImageUri ? { uri: item.userImageUri } : getFigureImage(item.figureId);
  };

  const getTypeColor = () => {
    switch (listing.listingType) {
      case 'sell': return theme.colors.primary;
      case 'swap': return theme.colors.swap;
      case 'iso': return theme.colors.iso;
      default: return theme.colors.primary;
    }
  };

  const getTypeBadge = () => {
    switch (listing.listingType) {
      case 'sell': return '💰 FOR SALE';
      case 'swap': return '⇄ SWAP';
      case 'iso': return '🔍 ISO';
      default: return '';
    }
  };

  const getShareMessage = () => {
    if (isIso) {
      return `🔍 ISO: ${figure?.character || listing.figureId}\n\nMax Budget: $${listing.price.toFixed(2)}\n📍 ${listing.location}\n📦 Looking for: ${listing.condition}\n\nContact: ${listing.sellerHandle}\n\n#HawkinsTrade #StrangerThings #ISO`;
    }
    if (isSwap) {
      return `⇄ Trade Offer!\n\n${listing.title}\nWants: ${targetFigure?.character || 'Any'}\n📍 ${listing.location}\n📦 Condition: ${listing.condition}\n\nContact: ${listing.sellerHandle}\n\n#HawkinsTrade #StrangerThings #Trade`;
    }
    return `🔥 Check out this Stranger Things collectible!\n\n${listing.title}\n💰 $${listing.price.toFixed(2)}\n📍 ${listing.location}\n📦 Condition: ${listing.condition}\n\nContact: ${listing.sellerHandle}\n\n#HawkinsTrade #StrangerThings #Collectibles`;
  };

  const handleShare = async () => {
    const message = getShareMessage();

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
        <View style={[
          styles.imageContainer,
          isIso && { borderWidth: 3, borderColor: theme.colors.iso, borderStyle: 'dashed' }
        ]}>
          <Image
            source={heroImage}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
            <Text style={styles.typeBadgeText}>{getTypeBadge()}</Text>
          </View>

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
          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {isIso ? `ISO: ${figure?.character || listing.figureId}` : listing.title}
          </Text>

          {/* Price/Swap Info */}
          {isSwap ? (
            <View style={styles.swapInfoLarge}>
              <Text style={[styles.swapIcon, { color: theme.colors.swap }]}>⇄</Text>
              <View>
                <Text style={[styles.swapLabel, { color: theme.colors.textSecondary }]}>
                  Wants to trade for:
                </Text>
                <Text style={[styles.swapTarget, { color: theme.colors.swap }]}>
                  {targetFigure?.character || 'Any figure'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.price, { color: getTypeColor() }]}>
              {isIso ? `Max: $${listing.price.toFixed(2)}` : `$${listing.price.toFixed(2)}`}
            </Text>
          )}

          {/* Swap Target Figure Preview */}
          {isSwap && targetFigure && (
            <View style={[styles.swapTargetCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.swap }]}>
              <Image
                source={getFigureImage(listing.swapTargetId!)}
                style={styles.swapTargetImage}
                resizeMode="cover"
              />
              <View style={styles.swapTargetInfo}>
                <Text style={[styles.swapTargetId, { color: theme.colors.textSecondary }]}>
                  {targetFigure.id}
                </Text>
                <Text style={[styles.swapTargetName, { color: theme.colors.text }]}>
                  {targetFigure.name}
                </Text>
                <Text style={[styles.swapTargetCharacter, { color: theme.colors.swap }]}>
                  {targetFigure.character}
                </Text>
              </View>
            </View>
          )}

          {/* Seller */}
          <TouchableOpacity
            style={styles.sellerRow}
            onPress={() => onSellerPress(listing.sellerHandle)}
          >
            <Text style={[styles.sellerLabel, { color: theme.colors.textSecondary }]}>
              {isIso ? 'Buyer:' : 'Seller:'}
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
          {filteredMoreBySeller.length > 0 && (
            <View style={styles.moreBySeller}>
              <Text style={[styles.moreBySellerTitle, { color: theme.colors.text }]}>
                More from {listing.sellerHandle}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moreBySellerScroll}
              >
                {filteredMoreBySeller.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.relatedCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                    onPress={() => onRelatedItemPress(item)}
                  >
                    <Image
                      source={getListingImage(item)}
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
                        {getFigureById(item.figureId)?.character || item.title.split(' ')[1]}
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
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
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
  swapInfoLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  swapIcon: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  swapLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  swapTarget: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
  },
  swapTargetCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 16,
    gap: 12,
  },
  swapTargetImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  swapTargetInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  swapTargetId: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginBottom: 2,
  },
  swapTargetName: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  swapTargetCharacter: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
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
