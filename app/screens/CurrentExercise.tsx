import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import UserContext from '../contexts/UserContext';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { getExercise, getExercises, getExercisesByFocus, getUser } from '../functions/databaseQueries';

interface User {
  activityLevel: string,
  age: number,
  experience: number,
  gender: string,
  height: number,
  level: number,
  name: string,
  weight: number
}

const CurrentExercise = ({route}) => {
  const { workoutType, focus } = route?.params;
  const userID = useContext(UserContext)

  const muscles ={
    'Full body': ['Calves', 'Quadriceps', 'Glutes', 'Hamstrings', 'Abs', 'Obliques', 'Chest', 'Lower back', 'Upper back', 'Traps', 'Lats', 'Front delts', 'Middle delts', 
                  'Rear delts', 'Biceps', 'Triceps', 'Forearms'],
    'Push': ['Chest', 'Front delts', 'Triceps', 'Middle delts'],
    'Pull': ['Lower back', 'Upper back', 'Traps', 'Lats', 'Biceps', 'Forearms', 'Rear delts'],
    'Leg': ['Calves', 'Quadriceps', 'Glutes', 'Hamstrings'],
    'Back' : ['Lower back', 'Upper back', 'Traps', 'Lats', 'Rear delts'],
    'Chest' : ['Chest'],
    'Bicep' : ['Biceps'],
    'Tricep' : ['Triceps'],
    'Shoulder': ['Front delts', 'Middle delts', 'Rear delts'],
    'Ab' : ['Abs', 'Obliques'],
    'Arm' : ['Biceps', 'Triceps', 'Forearms'],
    'Forearm': ['Forearms'],
    'Upper body': ['Abs', 'Obliques', 'Chest', 'Lower back', 'Upper back', 'Traps', 'Lats', 'Front delts', 'Middle delts', 
                  'Rear delts', 'Biceps', 'Triceps', 'Forearms'],
    'Full body pull' : ['Glutes', 'Hamstrings', 'Lower back', 'Upper back', 'Traps', 'Lats', 'Rear delts', 'Biceps',  'Forearms'],
    'Full body push' : ['Calves', 'Quadriceps', 'Chest', 'Front delts',  'Middle delts', 'Triceps'],
  }
  
  let exercises = getExercisesByFocus(userID, muscles[workoutType]);
  let user: User = getUser(userID);
  
  
  

  return (
    <View>
      <Text>{workoutType}</Text>
      <Text>{focus}</Text>
      {user && <>
      <Text>{user.name}</Text>
      <Text>{user.age}</Text>
      <Text>{user.activityLevel}</Text>
      <Text>{user.gender}</Text>
      
      </>}
      {exercises.map((exercise, index) => <Text key={index}>{exercise.name}</Text>)}
    </View>
  )
}

export default CurrentExercise

const styles = StyleSheet.create({})