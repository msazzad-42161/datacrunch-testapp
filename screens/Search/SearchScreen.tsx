import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native'
import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import Animated, { Easing, FadeIn, FadeInRight, FadeOutRight, LinearTransition } from 'react-native-reanimated'
import { COLORS, SPACING, STATUSBAR_HEIGHT } from '../../utils/theme'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SearchStackParamList } from '../../types'
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
const SearchScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SearchStackParamList,'SearchScreen'>>();
  const { setSearchQuery, addRecentSearch, recentSearches,clearRecentSearches } = useBookStore()
  const [localQuery, setLocalQuery] = useState('')

  // Handle search submission
  const handleSearchSubmit = () => {
    if (localQuery.trim().length < 2) return
    
    const query = localQuery.trim()
    setSearchQuery(query)
    addRecentSearch(query)
    
    navigation.navigate('SearchResults')
  }

  // Handle recent search item press
  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query)
    addRecentSearch(query)
    
    navigation.navigate('SearchResults')

  }

  // Clear recent searches
  const handleClearRecentSearches = () => {
    Alert.alert(
      'Clear Recent Searches',
      'Are you sure you want to clear all recent searches?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // You'll need to add this method to your store
            clearRecentSearches()
          }
        }
      ]
    )
  }

  // Render recent search item
  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item)}
    >
        <Text style={styles.recentSearchText}>{item}</Text>
        <Ionicons name="open-outline" style={styles.recentSearchArrow} />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <AnimatedTextInput
        layout={LinearTransition.easing(Easing.ease)}
          style={styles.searchInput}
          placeholder="Search for books..."
          value={localQuery}
          onChangeText={setLocalQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
        {localQuery.length>0 && (<Animated.Text entering={FadeInRight} exiting={FadeOutRight} onPress={()=>setLocalQuery('')}>Clear</Animated.Text>)}
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {recentSearches.length > 0 ? (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.recentSearchesContainer}
          >
            <View style={styles.recentSearchesHeader}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={handleClearRecentSearches}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches.slice(0, 15)} // Show last 15 searches
              keyExtractor={(item, index) => `recent-${index}`}
              renderItem={renderRecentSearchItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </Animated.View>
        ) : (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.welcomeContainer}
          >
            <Text style={styles.welcomeIcon}>📚</Text>
            <Text style={styles.welcomeTitle}>Start Searching</Text>
            <Text style={styles.welcomeText}>
              Search for your favorite books. Your recent searches will appear here for quick access.
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  )
}

export { SearchScreen }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingBottom:12,
    paddingTop:SPACING.lg + STATUSBAR_HEIGHT!,
    backgroundColor:COLORS.accent2,
    flexDirection:'row',
    alignItems:'center',
    gap:16
  },
  searchInput: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    flex:1
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  
  // Recent Searches Styles
  recentSearchesContainer: {
    flex: 1,
    gap:12
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:12,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight:"bold",
    // fontWeight: '600',
    color: COLORS.dark2
  },
  clearButton: {
    fontSize: 16,
    color: COLORS.accent1,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  recentSearchText: {
    fontSize: 12,
    // fontWeight:'600',
    // color: ,
    flex: 1,
    fontStyle:'italic'
  },
  recentSearchArrow: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  
  // Welcome State Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
})