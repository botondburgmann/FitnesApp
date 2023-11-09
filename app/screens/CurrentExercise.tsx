import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import {  getExercisesByFocus, getUser } from '../functions/databaseQueries';
import { Exercise, ExerciseSet } from '../types and interfaces/types';
import Set from '../components/Set';
import Rest from '../components/Rest';
import { calculateNumberOfSet, chooseExercises } from '../functions/otherFunctions';



const CurrentExercise = ({route}) => {
  const userID = useContext(UserContext)
  const { workoutType, focus } = route?.params;
  const muscles ={
    'Full body': ['Calves', 'Quadriceps', 'Glutes', 'Hamstrings', 'Abs', 'Obliques', 'Chest', 'Lower back', 'Upper back', 'Traps', 'Lats', 'Front delts', 'Middle delts', 
                  'Rear delts', 'Biceps', 'Triceps', 'Forearms', 'Adductors'],
    'Push': ['Chest', 'Front delts', 'Triceps', 'Middle delts'],
    'Pull': ['Lower back', 'Upper back', 'Traps', 'Lats', 'Biceps', 'Forearms', 'Rear delts'],
    'Leg': ['Calves', 'Quadriceps', 'Glutes', 'Hamstrings', 'Adductors'],
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
    'Full body pull' : ['Glutes', 'Hamstrings', 'Lower back', 'Upper back', 'Traps', 'Lats', 'Rear delts', 'Biceps',  'Forearms', 'Adductors'],
    'Full body push' : ['Calves', 'Quadriceps', 'Chest', 'Front delts',  'Middle delts', 'Triceps'],
  }
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [activityLevel, setActivityLevel] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [workout, setWorkout] = useState([]);

  const [sets, setSets] = useState<ExerciseSet>({
      exercise : [],
      weights: [],
      reps: [],
      times: [],
      restTimes: [],
      sides: []
    });

  
  useEffect(() => {
    const unsubscribe = getExercisesByFocus(userID, muscles[workoutType], (exercises) => {
      setExercises(exercises);
      setLoadingExercises(false);
    })
  
    return () => {
      unsubscribe();
      setExercises([]);
      setLoadingExercises(true);
    }
  }, [userID, workoutType]);
  
  useEffect(() => {
    const unsubscribe = getUser(userID, (user) => {
        setActivityLevel(user.activityLevel);
        setLoadingUser(false);

      })
      return () => {
        unsubscribe();
        setActivityLevel("");
        setLoadingUser(true);
      }
    }, [userID]);
  
 

  


  

  
  useEffect(() => {
    if (!loadingUser && !loadingExercises) {
    const workout = [];    
    const selectedExercises: Exercise[] = chooseExercises(exercises, activityLevel);
    const numberOfSets = calculateNumberOfSet(focus, activityLevel);
    setSelectedExercises(selectedExercises);
    
    for (let i = 0; i < selectedExercises.length; i++) {
       for (let j = 0; j < numberOfSets; j++) {
        workout.push(<Set  key={`set-${selectedExercises[i].name}-${j}`} 
          exercise={selectedExercises[i]} 
          focus={focus}
          setGoToNextPage={setGoToNextPage}
          setSets={setSets}/>)
        if (j < numberOfSets-1 || i < selectedExercises.length-1)
          workout.push(<Rest key={`rest-${selectedExercises[i].name}-${j}`} exercise={selectedExercises[i]} 
          setGoToNextPage={setGoToNextPage} setSets={setSets}/>)
      } 
      
    }
    workout.push(<View><Text>Congrasts</Text></View>)
    setWorkout(workout)
    
  
}

}, [loadingExercises, loadingUser])


const [currentIndex, setCurrentIndex] = useState(0);
const [goToNextPage, setGoToNextPage] = useState(false);

useEffect(() => {
  if (goToNextPage) {
    if (currentIndex < workout  .length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    if (currentIndex % 2 === 1) {
      console.log(sets.exercise);
      console.log(sets.reps);
      console.log(sets.restTimes);
      console.log(sets.sides);
      console.log(sets.times);
      console.log(sets.weights);
      
    }
    
    setGoToNextPage(false)
  }
}, [goToNextPage])

  return (
    <View style={styles.container}>
      {
        loadingExercises || loadingUser ? <ActivityIndicator />
        :
      <ScrollView>
      {workout[currentIndex]}
{/*       <Pressable style={styles.button} onPress={nextComponent}>
            <Text style={styles.text}>Next</Text>                   
        </Pressable>  */}
        </ScrollView>
  /*       <ScrollView>
      {workout}
        </ScrollView> */
      }
    </View>
  )
}

export default CurrentExercise

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ff0000'
},
 
  text:{
      alignSelf: 'center',
      fontSize: 18,
      color: "#fff",
      textTransform: 'uppercase',
      fontWeight: "600",
      paddingVertical: 10,
  },
  button:{
      width: 100,
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignSelf: "center",
      backgroundColor: "#000",
  },
});