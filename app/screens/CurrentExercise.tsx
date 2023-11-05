import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import {  getExercisesByFocus, getUser } from '../functions/databaseQueries';
import { Exercise, ExerciseSet } from '../types and interfaces/types';
import Set from '../components/Set';
import Rest from '../components/Rest';



const CurrentExercise = ({route}) => {
  const { workoutType, focus, act } = route?.params;
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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  
  useEffect(() => {
    const unsubscribeFromExercises = getExercisesByFocus(userID, muscles[workoutType], (exercises) => {
      setExercises(exercises);
      setLoadingExercises(false);
    })
  
    return () => {
      unsubscribeFromExercises();
    }
  }, [userID, workoutType]);
  
  const [activityLevel, setActivityLevel] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
    useEffect(() => {
      const unsubscribeFromUsers = getUser(userID, (user) => {
        setActivityLevel(user.activityLevel);
        
        setLoadingUser(false);

      })
      return () => {
        unsubscribeFromUsers();
      }
    }, [userID]);
  
  function calculateNumberOfSet(focus:string, activityLevel: string): number {
    let numberOfSet = 0;
    switch (activityLevel) {
      case "beginner":
        numberOfSet = focus === "strength" ?  1 : Math.floor(Math.random() * (3 - 2 + 1) + 2);
        break;
      case "intermediate":
        numberOfSet =  focus === "strength" ? 2 : Math.floor(Math.random() * (3 - 2 + 1) + 2);
        break;
      case "advanced":
        numberOfSet = focus === "strength" ?  numberOfSet = Math.floor(Math.random() * (3 - 2 + 1) + 2): Math.floor(Math.random() * (4 - 3 + 1) + 3);
      default:
        throw new Error("invalid activityLevel");
    }
    return numberOfSet;
  }

  function shuffleArray(array) {
    const shuffledArray = [...array];
  
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
  
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    return shuffledArray;
  }
  

  function chooseExercises(exercises:Exercise[], activityLevel: string ): Exercise[] {
    const shuffledExercises = shuffleArray(exercises);
    const workout = [];
    switch (activityLevel) {
      case "beginner":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && workout.length < 3)
            workout.push(exercise);
        break;
      case "intermediate":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && workout.length < 3)
            workout.push(exercise);
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length === 1 && workout.length < 5)
            workout.push(exercise);
      case "advanced":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && workout.length < 3)
            workout.push(exercise);
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length === 1 && workout.length < 6)
            workout.push(exercise);
      default:
        console.log(activityLevel);
        
        //throw new Error("invalid activityLevel");
      }
      return workout;
  }
  

  const workout = [];

if (activityLevel) {
  const selectedExercises = chooseExercises(exercises, activityLevel);
  const numberOfSets = calculateNumberOfSet(focus, activityLevel);

  for (let i = 0; i < selectedExercises.length; i++) {
    for (let j = 0; j < numberOfSets; j++) {
      workout.push(<Set exercise={selectedExercises[i]} focus={focus}/>)

      workout.push(<Rest/>)
    }
    
  }
  workout.push(<View><Text>Congrasts</Text></View>)
}

const [currentIndex, setCurrentIndex] = useState(0);

  const nextComponent = () => {
    if (currentIndex < workout  .length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <View>
      {
        loadingExercises ? <ActivityIndicator />
        :
      <ScrollView>
      {workout[currentIndex]}
      <Pressable style={styles.button} onPress={nextComponent}>
            <Text style={styles.text}>Next</Text>                   
        </Pressable>
        </ScrollView>
/*         <ScrollView>
      {workout}
        </ScrollView> */
      }
    </View>
  )
}

export default CurrentExercise

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#ff0000'
  },
  input: {
      marginHorizontal: 10,
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
  },
  text:{
      alignSelf: 'center',
      fontSize: 18,
      color: "#fff",
      textTransform: 'uppercase',
      fontWeight: "600",
      paddingVertical: 10,
  },
  gridContainer:{
      flexDirection: 'row',
      marginHorizontal: 10,
      justifyContent: 'center'
  },
  button:{
      width: 100,
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignSelf: "center",
      backgroundColor: "#000",
  },
  label: {
      fontSize: 20,
      fontWeight: "800",
      color: "#fff",
      textTransform: 'uppercase',
      textAlign: 'center',
      marginVertical: 50
  },
});