import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { getExercisesByFocus } from '../functions/databaseQueries';
import useFetch from '../hooks/useFetch';
import UserContext from '../contexts/UserContext';

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
    'Full push pull' : ['Calves', 'Quadriceps', 'Chest', 'Front delts',  'Middle delts', 'Triceps'],
  }

  const {data:exercises, isPending:exercisesPending, error:exercisesError } = useFetch(getExercisesByFocus, userID, muscles[workoutType]);

  const whatToTrain = []

  if (exercises) {
    
    exercises.forEach(exercise => {whatToTrain.push(<Text key={exercise.name}>{exercise.name}</Text>)
      
    });
  }
  



  

  return (
    <View>
      <Text>{workoutType}</Text>
      <Text>{focus}</Text>
      {whatToTrain}
    </View>
  )
}

export default CurrentExercise

const styles = StyleSheet.create({})