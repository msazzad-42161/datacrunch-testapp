import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal, TouchableOpacity } from 'react-native';
import { Book } from '../../types/book';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';
import { BOOK_ASPECT_RATIO, COVER_WIDTH, MINI_COVER_WIDTH } from '../../utils/constants';
import { useBookStore } from '../../store/bookStore';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

interface BookCardProps {
  book: Book;
  variant?: 'mini' | 'normal';
}

const getCoverUrl = (cover_i?: number) =>
  cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    : 'https://via.placeholder.com/100x150?text=No+Cover';

const MiniBookCard: React.FC<{ book: Book }> = ({ book }) => (
  <View style={miniStyles.card}>
    <Image
      source={{ uri: getCoverUrl(book.cover_i) }}
      style={miniStyles.cover}
      resizeMode="cover"
    />
    <View style={miniStyles.info}>
      <Text style={miniStyles.title} numberOfLines={2}>{book.title}</Text>
      {book.author_name && (
        <Text style={miniStyles.author} numberOfLines={1}>{book.author_name.join(', ')}</Text>
      )}
    </View>
  </View>
);

const NormalBookCard: React.FC<{ book: Book }> = ({ book }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: getCoverUrl(book.cover_i) }}
      style={styles.cover}
      resizeMode="cover"
    />
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      {book.author_name && (
        <Text style={styles.author} numberOfLines={1}>by {book.author_name.join(', ')}</Text>
      )}
      {book.subject && book.subject.length > 0 && (
        <Text style={styles.subjects} numberOfLines={1}>
          Categories: {book.subject.slice(0, 3).join(', ')}
        </Text>
      )}
      {book.first_publish_year && (
        <Text style={styles.year}>Year: {book.first_publish_year}</Text>
      )}
    </View>
  </View>
);

const FavoriteModal: React.FC<{
  visible: boolean;
  book: Book;
  onClose: () => void;
  variant: 'mini' | 'normal';
}> = ({ visible, book, onClose, variant }) => {
  const { toggleFavorite, isFavorite } = useBookStore();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  const isBookInFavorites = isFavorite(book.key);
  
  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleToggleFavorite = () => {
    toggleFavorite(book);
    // Close modal after a short delay to show the action completed
    setTimeout(onClose, 300);
  };

  const CardComponent = variant === 'mini' ? MiniBookCard : NormalBookCard;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
        <Animated.View style={[modalStyles.backdrop, animatedBackdropStyle]} />
      </Pressable>
      
      <View style={modalStyles.container}>
        <Animated.View style={[modalStyles.modal, animatedModalStyle]}>
          {/* Book Card Display */}
          <View style={modalStyles.bookContainer}>
            <CardComponent book={book} />
          </View>
          
          {/* Action Buttons */}
          <View style={modalStyles.buttonContainer}>
            {isBookInFavorites ? (
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.removeButton]}
                onPress={handleToggleFavorite}
              >
                <Text style={modalStyles.removeButtonText}>Remove from Favorites</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.addButton]}
                onPress={handleToggleFavorite}
              >
                <Text style={modalStyles.addButtonText}>Add to Favorites</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const BookCard: React.FC<BookCardProps> = ({ book, variant = 'normal' }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  
  const CardComponent = variant === 'mini' ? MiniBookCard : NormalBookCard;
  
  const handlePress = () => {
    navigation.navigate('BookDetails', { key: book.key, first_publish_year: book?.first_publish_year });
  };
  
  const handleLongPress = () => {
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable 
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        delayLongPress={500}
      > 
        <CardComponent book={book} />
      </Pressable>
      
      <FavoriteModal
        visible={modalVisible}
        book={book}
        onClose={handleCloseModal}
        variant={variant}
      />
    </>
  );
};

export { BookCard };

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cover: {
    width: COVER_WIDTH,
    aspectRatio: BOOK_ASPECT_RATIO,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginRight: 14,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  author: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  subjects: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  year: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});

const miniStyles = StyleSheet.create({
  card: {
    width: MINI_COVER_WIDTH,
    alignItems: 'center',
  },
  cover: {
    width: MINI_COVER_WIDTH,
    aspectRatio: BOOK_ASPECT_RATIO,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginBottom: 6,
  },
  info: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  author: {
    fontSize: 10,
    color: '#666',
    marginTop: 1,
    textAlign: 'center',
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '90%',
    width: '100%',
  },
  bookContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});