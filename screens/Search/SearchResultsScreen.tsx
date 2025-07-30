import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useBookStore } from '../../store/bookStore'
import { useSearchBooks } from '../../hooks/useBooks'
import { BookCard } from '../../components/common/BookCard'
import { COLORS } from '../../utils/theme'

const SearchResultsScreen = () => {
  const {searchQuery} = useBookStore()
  const {data,isLoading,error} = useSearchBooks(searchQuery)
  if(isLoading) return (<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
<Text style={{textAlign:'center'}}>Uhmmm... <Text style={{color:COLORS.accent2,fontWeight:'bold'}}>{searchQuery}</Text>. Is it? Hmmm... {"\n"}Give me a moment</Text>
<ActivityIndicator size={'small'}/>
  </View>)
  return (
    <View style={styles.container}>
    <FlatList
      data={data?.docs}
      keyExtractor={item => item.key}
      renderItem={({ item }) => <BookCard book={item} />}
      contentContainerStyle={styles.listContent}
    />
  </View>
  )
}

export {SearchResultsScreen}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
    gap:12
  },
})