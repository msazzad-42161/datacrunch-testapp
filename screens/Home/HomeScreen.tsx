import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import {  useAuthorBooksDetailed, useClassicBooks, useSubjectBooks, useTrendingBooks } from '../../hooks/useBooks'
import { BookCard } from '../../components/common/BookCard'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { HomeStackParamList } from '../../types/navigation'
import { HorizontalBookList } from '../../components/common/HorizontalBookList'

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useTrendingBooks();
  const { data: classicBooksData, isLoading: loadingClassicBooksData, error: classicBooksDataError } = useClassicBooks();
  const { data: thrillerData, isLoading: thrillerLoading, error: thrillerError } = useSubjectBooks("thriller");
  const { data: comedyData, isLoading: comedyLoading, error: comedyError } = useSubjectBooks("comedy");
  const { data: kidsData, isLoading: kidsLoading, error: kidsError } = useSubjectBooks("kids");
  const { data: islamicBooks, isLoading: islamicLoading, error: islamicError } = useSubjectBooks("islamic");
  const { data: jkRowlingBooks, isLoading: jkRowlingLoading, error: jkRowlingError } = useAuthorBooksDetailed('OL23919A'); // J.K. Rowling
  const { data: stephenKingBooks, isLoading: stephenKingLoading, error: stephenKingError } = useAuthorBooksDetailed('OL19981A'); // Stephen King


  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Trending Books Horizontal List */}
      <HorizontalBookList
        title="Trending Books"
        books={trendingData?.docs}
        isLoading={trendingLoading}
        error={trendingError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="No trending books found."
      />
      
      {/* Trending Books Horizontal List */}
      <HorizontalBookList
        title="Islamic Books"
        books={islamicBooks?.docs}
        isLoading={islamicLoading}
        error={islamicError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="No islamics books found."
      />

      {/* Classic Books Horizontal List */}
      <HorizontalBookList
        title="Classic"
        books={classicBooksData?.docs}
        isLoading={loadingClassicBooksData}
        error={classicBooksDataError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="Nothing to show"
      />

      {/* Thriller Books Horizontal List */}
      <HorizontalBookList
        title="Thriller"
        books={thrillerData?.docs}
        isLoading={thrillerLoading}
        error={thrillerError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="Nothing to show"
      />

      {/* Comedy Books Horizontal List */}
      <HorizontalBookList
        title="Comedy"
        books={comedyData?.docs}
        isLoading={comedyLoading}
        error={comedyError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="Nothing to show"
      />

      {/* Kids Books Horizontal List */}
      <HorizontalBookList
        title="Kids"
        books={kidsData?.docs}
        isLoading={kidsLoading}
        error={kidsError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="Nothing to show"
      />

      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={require('../../assets/splash-icon.png')} // Update the path/image as needed
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      {/* J. K. Rowling Books Horizontal List */}
      <HorizontalBookList
        title="J. K. Rowling"
        books={jkRowlingBooks}
        isLoading={jkRowlingLoading}
        error={jkRowlingError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="Nothing to show"
      />

      {/* Stephen King Books Horizontal List */}
      <HorizontalBookList
        title="Stephen King"
        books={stephenKingBooks}
        isLoading={stephenKingLoading}
        error={stephenKingError}
        showSeeAll={true}
        maxItems={10}
        emptyMessage="Nothing to show"
      />
    </ScrollView>
  )
}

export {HomeScreen}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    gap:12
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginBottom: 20,
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: 12,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  banner: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    width:"100%",
    aspectRatio: 2.5,
    overflow:'hidden'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
})