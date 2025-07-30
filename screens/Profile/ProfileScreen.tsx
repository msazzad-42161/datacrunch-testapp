import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { notificationService } from '../../services/notificationService'
import { useTrendingBooks } from '../../hooks/useBooks'

const ProfileScreen = () => {
  const {data,isLoading,error} = useTrendingBooks()
  return (
    <View>
      <Text onPress={()=>{
        notificationService.sendBookRecommendation(data?.docs?.[Math.floor(Math.random() * 10)]!)
      }}>ProfileScreen</Text>
    </View>
  )
}

export {ProfileScreen}

const styles = StyleSheet.create({})