import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../../types/navigation'
import { BookCard } from '../../components/common/BookCard'

const BookListScreen = () => {
  const route = useRoute<RouteProp<HomeStackParamList, 'BookListScreen'>>();
  const navigation = useNavigation();
  const { title, books } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.key}
        renderItem={({ item }) => <BookCard book={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export {BookListScreen}

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