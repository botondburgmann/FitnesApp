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
    'Full body push' : ['Calves', 'Quadriceps', 'Chest', 'Front delts',  'Middle delts', 'Triceps'],
  }

  const {data:exercises, isPending:exercisesPending, error:exercisesError } = useFetch(getExercisesByFocus, userID, muscles[workoutType]);
  
  const whatToTrain = [];

  if (exercises) {
    const workout = {
      exercises: [],
      numberOfSets: [],
      numberOfReps: [],
    };
    if (focus === "Strength") {
      createStrengthTraining(exercises, workout)
    }
    else if (focus === "Hypertrophy")
      createHypertrophyTraining(exercises, workout);

  }


  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
  }
  
  function createStrengthTraining(exercises, workout) {

    let numberOfRemainingExercises = 3;
    for (const exercise of exercises) {
      if (exercise.musclesWorked.length > 2 && numberOfRemainingExercises > 0) {
        let selectOrNot = Math.round(Math.random());
        if (selectOrNot) {
          workout.exercises.push(exercise);
          const numberOfSet =  Math.floor(Math.random() * (3 - 1 + 1)) + 1;
          workout.numberOfSets.push(numberOfSet);
          const numberOfReps =  Math.floor(Math.random() * (4 - 2 + 1)) + 2 ;
          workout.numberOfReps.push(numberOfReps);
          numberOfRemainingExercises--;
        }
      }
    }
    if (workout.exercises.length === 0) {
      alert("Can't create strength training for this type")
    }
    for (let i = 0; i < workout.exercises.length; i++) {
      whatToTrain.push(<Text key={workout.exercises[i].name}>{workout.exercises[i].name} {workout.numberOfSets[i]} sets for {workout.numberOfReps[i]-1}-{workout.numberOfReps[i]+1} reps</Text>);
      
    }

  }

  function createHypertrophyTraining(exercises, workout) {
    shuffleArray(exercises)
    
    if (muscles[workoutType].length > 1) {
      for (const exercise of exercises) {
        const result = exercise.musclesWorked.some(muscle => muscles[workoutType].includes(muscle));      
        
        if (result) {
          workout.exercises.push(exercise);
          const numberOfSet =  Math.floor(Math.random() * (5 - 3 + 1)) + 3;
          workout.numberOfSets.push(numberOfSet);
          const numberOfReps =  Math.floor(Math.random() * (8 - 7 + 1)) + 7 ;
          workout.numberOfReps.push(numberOfReps);
          whatToTrain.push(<Text key={exercise.name}>{exercise.name}  {numberOfSet} sets for {numberOfReps-1}-{numberOfReps+1} reps </Text>);
          muscles[workoutType] = muscles[workoutType].filter((muscle) => !exercise.musclesWorked.includes(muscle))          
        
  
        } 
    }
    }
    else{
      let numberOfRemainingExercises = 6;

    //  for (let i = 0; i < 6; i++) {
        for (const exercise of exercises) {
          const result = exercise.musclesWorked.some(muscle => muscles[workoutType].includes(muscle));      
          
          if (result && numberOfRemainingExercises > 0) {
            workout.exercises.push(exercise);
            const numberOfSet =  Math.floor(Math.random() * (5 - 3 + 1)) + 3;
            workout.numberOfSets.push(numberOfSet);
            const numberOfReps =  Math.floor(Math.random() * (8 - 7 + 1)) + 7 ;
            workout.numberOfReps.push(numberOfReps);
            whatToTrain.push(<Text key={exercise.name}>{exercise.name}  {numberOfSet} sets for {numberOfReps-1}-{numberOfReps+1} reps </Text>);
            numberOfRemainingExercises--;
    
          }
        }
     // }
    }

 /*    for (const exercise of exercises) {
      if (exercise.musclesWorked.length > 2 && numberOfRemainingExercises > 0) {
        let selectOrNot = Math.round(Math.random());
        if (selectOrNot) {
          workout.exercises.push(exercise);
          const numberOfSet =  Math.floor(Math.random() * (3 - 1 + 1)) + 1;
          workout.numberOfSets.push(numberOfSet);
          const numberOfReps =  Math.floor(Math.random() * (5 - 1 + 1)) +1 ;
          workout.numberOfReps.push(numberOfReps);
          numberOfRemainingExercises--;
        }
      }
    }
    if (workout.exercises.length === 0) {
      alert("Can't create strength training for this type")
    }
    for (let i = 0; i < workout.exercises.length; i++) {
      whatToTrain.push(<Text key={workout.exercises[i].name}>{workout.exercises[i].name} {workout.numberOfSets[i]} sets for {workout.numberOfReps[i]} reps</Text>);
      
    } */

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