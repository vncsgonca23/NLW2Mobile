import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {useFocusEffect} from'@react-navigation/native'
import { styles } from './styles';
import { PageHeader } from '../../components/PageHeader';
import { TeacherItem, ITeacher } from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage'

const Favorites: React.FC = () => {
  const [favorites,setFavorites] = useState([])
  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response=>{
      if(response){
        const favoritedTeachers = JSON.parse(response)
        setFavorites(favoritedTeachers)
      }
    })
  }
  useFocusEffect(
    React.useCallback(()=>{
      loadFavorites()
    },[])
  )
  
  return (
    <View style={styles.container}>
      <PageHeader title="Meus proffys Favoritos"/>
      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {favorites.map((teacher:ITeacher)=>{
          return(
            <TeacherItem key={teacher.id} teacher={teacher} favorited/>
          )
        })}
      </ScrollView>
    </View>
  )
}

export {Favorites};