import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';

import { styles } from './styles';
import { PageHeader } from '../../components/PageHeader';
import { TeacherItem, ITeacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'
import { api } from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native';
const TeacherList: React.FC = () => {
  const [isFiltersVisible,setIsFiltersVisible] = useState(false)
  const [favorites,setFavorites] = useState<number[]>([])
  const [teachers,setTeachers] = useState([])
  const [week_day,setWeekDay] = useState('')
  const [subject,setSubject] = useState('')
  const [time,setTime] = useState('')

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response=>{
      if(response){
        const favoritedTeachers = JSON.parse(response)
        const favoritedTeachersIds = favoritedTeachers.map((teacher:ITeacher)=>{
          return teacher.id
        })
        setFavorites(favoritedTeachersIds)
      }
    })
  }
  useFocusEffect(
    React.useCallback(()=>{
      loadFavorites()
    },[])
  )
  function handleToggleFiltersVisible(){
    setIsFiltersVisible(!isFiltersVisible)
  }
  async function handleFiltersSubmit(){
    loadFavorites()
    const response = await api.get('classes',{
      params:{
        subject,
        week_day,
        time
      }
    })
    setIsFiltersVisible(false)
    setTeachers(response.data)
  }
  
  return (
    <View style={styles.container} >
      <PageHeader 
        title="Proffys Disponíveis" 
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" color="#FFF" size={20}/>
          </BorderlessButton>
        )}
      >
      { isFiltersVisible && (
        <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              placeholderTextColor="#C1BCCC"
              style={styles.input}
              value={subject}
              onChangeText={text=>setSubject(text)}
              placeholder="Qual a matéria?"
            />
          <View style={styles.inputGroup}>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Dia da semana</Text>
              <TextInput
                placeholderTextColor="#C1BCCC"
                style={styles.input}
                value={week_day}
                onChangeText={text=>setWeekDay(text)}
                placeholder="Qual o dia?"
              />
            </View>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                placeholderTextColor="#C1BCCC"
                style={styles.input}
                value={time}
                onChangeText={text=>setTime(text)}
                placeholder="Qual horário?"
              />
            </View>
          </View>
          <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
            <Text style={styles.submitButtonText}>Filtrar</Text>
          </RectButton>
        </View>
      )}
      </PageHeader>
      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher:ITeacher)=>{
          return(
            <TeacherItem key={teacher.id}  teacher={teacher} favorited={favorites.includes(teacher.id)}/>
          )
        })} 
      </ScrollView>
    </View>
  )
}

export {TeacherList};