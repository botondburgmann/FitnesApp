import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import {  addWorkout, getExercisesByFocus, getUser } from '../functions/databaseQueries';
import { Exercise, ExerciseSet } from '../types and interfaces/types';
import Set from '../components/Set';
import Rest from '../components/Rest';
import { addXP, calculateNumberOfSet, chooseExercises } from '../functions/otherFunctions';
import { NavigationProp } from '@react-navigation/native';


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const CurrentExercise = ({ route, navigation }: RouterProps) => {
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
  const [workoutComponents, setWorkoutComponents] = useState([]);
  const [workout, setWorkout] = useState<ExerciseSet[]>([]);
  const [isFinal, setIsFinal] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

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
      setWorkout([]);

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
        if (j < numberOfSets-1 || i < selectedExercises.length-1){
          workout.push(<Rest key={`rest-${selectedExercises[i].name}-${j}`} exercise={selectedExercises[i]} 
          setGoToNextPage={setGoToNextPage} setSets={setSets}/>)
        }
      } 
      
    }
    setWorkoutComponents(workout)
    
  
}

}, [loadingExercises, loadingUser])


const [currentIndex, setCurrentIndex] = useState(0);
const [goToNextPage, setGoToNextPage] = useState(false);

useEffect(() => {
  if (goToNextPage) {
    if (currentIndex < workoutComponents  .length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (currentIndex === workoutComponents  .length - 1) {
      setIsFinal(true)
      sets.restTimes.push(0);
      setWorkout(prev => [...prev, sets]);
      if (sets.reps[0] === 0) {
        console.log("add iso");
        
        setTotalXP(prev => { return prev + addXP(true, sets)})
      }
      else {
        console.log("add norm");

        setTotalXP(prev => { return prev + addXP(false, sets)})
      }

    } 
    
    
    if (currentIndex % 2 === 1 && sets.exercise[sets.exercise.length-1] !== sets.exercise[sets.exercise.length-2] && sets.exercise.length > 1) {
      const newExercise: ExerciseSet = {
        exercise: sets.exercise.slice(0,-1),
        reps: sets.reps.slice(0,-1),
        restTimes: sets.restTimes.slice(0,-1),
        sides: sets.sides.slice(0,-1),
        times: sets.times.slice(0,-1),
        weights: sets.weights.slice(0,-1)
      }
      setWorkout(prev => [...prev, newExercise]);
      if (newExercise.reps[0] === 0) {
        console.log("add iso");
        
        setTotalXP(prev => { return prev + addXP(true, newExercise)})
      }
      else {
        console.log("add norm");

        setTotalXP(prev => { return prev + addXP(false, newExercise)})
      }
      
      sets.exercise.splice(0, sets.exercise.length-1);
      sets.reps.splice(0, sets.reps.length-1);
      sets.restTimes.splice(0, sets.restTimes.length-1);
      sets.sides.splice(0, sets.sides.length-1);
      sets.times.splice(0, sets.times.length-1);
      sets.weights.splice(0, sets.weights.length-1);
      
      
    }
    
    setGoToNextPage(false)
  }
}, [goToNextPage])

  function handleFinishWorkoutButton(workout: ExerciseSet[], userID: string, date: string, totalXP: number): void {
    console.log(totalXP);
    
    addWorkout(userID, date, workout, totalXP );
    navigation.navigate("Log");
  }

  return (
    <View style={styles.container}>
      {
        loadingExercises || loadingUser ? <ActivityIndicator />
        : !isFinal ?
      <ScrollView>
      {workoutComponents[currentIndex]}
        </ScrollView>
      : <View>
        <Text style={styles.text}>Congrats</Text>
        <Pressable style={styles.button} onPress={() => handleFinishWorkoutButton(workout, userID, new Date().toDateString(), totalXP)}>
            <Text style={styles.text}>Next</Text>                   
        </Pressable>
      </View>
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