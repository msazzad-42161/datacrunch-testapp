import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BookCard } from '../common/BookCard';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../types/navigation';
import { Book } from '../../types';

interface HorizontalBookListProps {
  title: string;
  books?: Book[];
  isLoading: boolean;
  error?: Error | null;
  showSeeAll?: boolean;
  maxItems?: number;
  emptyMessage?: string;
}

export const HorizontalBookList: React.FC<HorizontalBookListProps> = ({
  title,
  books = [],
  isLoading,
  error,
  showSeeAll = false,
  maxItems = 10,
  emptyMessage = 'No books found.',
}) => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  const handleSeeAll = () => {
    if (books && books.length > 0) {
      navigation.navigate('BookListScreen', {
        title: title,
        books: books,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>{title}</Text>
        {showSeeAll && (
          <TouchableOpacity style={styles.seeAllBtn} onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
      
      {error && <Text style={styles.error}>Error loading {title.toLowerCase()}.</Text>}
      
      {books && books.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScroll} 
          contentContainerStyle={styles.horizontalContent}
          snapToInterval={82} // 70 (card width) + 12 (gap), adjust as needed
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {books.slice(0, maxItems).map((book) => (
            <BookCard key={book.key} book={book} variant="mini" />
          ))}
        </ScrollView>
      ) : !isLoading && !error && (
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap:8
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
  horizontalScroll: {
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: 12,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  emptyMessage: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
});