import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useBookStore } from '../../store/bookStore'
import { BookCard } from '../../components/common/BookCard'
import Animated, { Easing, LinearTransition } from 'react-native-reanimated'
import { COLORS, FONTSIZE } from '../../utils/theme'

const FavoritesScreen = () => {
  const {favorites} = useBookStore()
 
  return (
    <View style={styles.container}>
      {(favorites && favorites.length > 0) ? (
        <Animated.FlatList
          data={favorites}
          keyExtractor={item => item.key}
          renderItem={({ item }) => <BookCard book={item} />}
          contentContainerStyle={styles.listContent}
          itemLayoutAnimation={LinearTransition.easing(Easing.ease)}
        />
      ):(
        <Text style={{fontSize:FONTSIZE.subheading,alignSelf:'center',textAlign:'center'}}>No favorites book.{"\n"}<Text onPress={()=>{
          // navigation.navigate("SearchScreen")
        }} style={{color:COLORS.dark2,fontWeight:"bold",textDecorationLine:'underline'}}>Search</Text> to add your favorite ones here 😉</Text>
      )}
    </View>
  )
}

export {FavoritesScreen}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
    gap: 12
  },
})