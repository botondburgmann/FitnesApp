import { ActivityIndicator, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../contexts/UserContext';
import {  addWorkout, getExercisesByFocus, getUser } from '../functions/databaseQueries';
import { Exercise, ExerciseSet, MuscleGroups } from '../types and interfaces/types';
import Set from '../components/Set';
import Rest from '../components/Rest';
import { addXP, calculateNumberOfSet, chooseExercises } from '../functions/otherFunctions';
import { NavigationProp } from '@react-navigation/native';
import { backgroundImage, globalStyles } from '../assets/styles';
import WeekContext from '../contexts/WeekContext';


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const CurrentExercise = ({ route, navigation }: RouterProps) => {
  const userID = useContext(UserContext)
  const week = useContext(WeekContext)
  const { workoutType, focus } = route?.params;
  const muscles: MuscleGroups  ={
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
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [activityLevel, setActivityLevel] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [workoutComponents, setWorkoutComponents] = useState<React.JSX.Element[]>([]);
  const workout = useRef<ExerciseSet[]>([]);
  const [endOfWorkout, setEndofWorkout] = useState(false);
  const totalXP = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goToNextPage, setGoToNextPage] = useState(false);

  const currentExercise = useRef<ExerciseSet>({
    exercise : [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  })

  
   useEffect(() => {
    const unsubscribeFromGetExerciseByFocus = getExercisesByFocus(userID, muscles[workoutType], (exercises: React.SetStateAction<Exercise[]>) => {
      setExercises(exercises);
      setLoadingExercises(false);
    })
  
    return () => {
      if (unsubscribeFromGetExerciseByFocus !== undefined)
        unsubscribeFromGetExerciseByFocus();
    }
  }, [userID, workoutType]);
 
  useEffect(() => {
    const unsubscribe = getUser(userID, (user: { activityLevel: React.SetStateAction<string>; }) => {
        setActivityLevel(user.activityLevel);
        setLoadingUser(false);

      })
      return () => {
        unsubscribe();
      }
    }, [userID]);
   

  useEffect(() => {
    if (!loadingUser && !loadingExercises) {
      const selectedExercises: Exercise[] = chooseExercises(exercises, activityLevel);
      const numberOfSets = calculateNumberOfSet(focus, activityLevel);
      const workoutComponents: React.JSX.Element[] = []
    
      for (let i = 0; i < selectedExercises.length; i++) {
        for (let j = 0; j < numberOfSets; j++) {
          workoutComponents.push(<Set  
            key={`set-${selectedExercises[i].name}-${j}`} 
            exercise={selectedExercises[i]} 
            focus={focus}
            setGoToNextPage={setGoToNextPage}
            currentExercise={currentExercise.current}
          />)          
          workoutComponents.push(<Rest 
            key={`rest-${selectedExercises[i].name}-${j}`} 
            exercise={selectedExercises[i]} 
            setGoToNextPage={setGoToNextPage} 
            currentExercise={currentExercise.current}
          />)
      
        } 
      }
      setWorkoutComponents(workoutComponents)
      
          }

  }, [loadingExercises, loadingUser])




useEffect(() => {
  if (goToNextPage) {
    if (currentIndex < workoutComponents.length-1)
      setCurrentIndex(currentIndex+1);
    else if (currentIndex === workoutComponents.length-1) {
      
      setEndofWorkout(true)
      if (currentExercise.current.sides[currentExercise.current.sides.length-1] === "right")
        currentExercise.current.restTimes.push(...[0,0]);
      else
        currentExercise.current.restTimes.push(0);
      
      const resultArray = currentExercise.current.exercise.reduce((acc: ExerciseSet[], _, index) => {
        const exerciseName = currentExercise.current.exercise[index];
      
        const existingExercise = acc.find((item) => (item as { exercise: string[] }).exercise[0] === exerciseName);
      
        if (existingExercise) {
          Object.keys(currentExercise.current).forEach((key) => {
            const existingExercise = acc.find((item) => (item as { [key: string]: any })[key] === exerciseName);
            if (existingExercise) {
              const existingExerciseKey = existingExercise[key] as any[];
              existingExerciseKey.push(currentExercise.current[key][index]);
            }
                      });
        } else {
          const newExercise: ExerciseSet = {
            exercise: [],
            weights: [],
            reps: [],
            times: [],
            restTimes: [],
            sides: []
          };
          Object.keys(currentExercise.current).forEach((key) => {
            newExercise[key] = [currentExercise.current[key][index]];
          });
          acc.push(newExercise);
        }
      
        return acc;
      }, []);
      
      workout.current = resultArray
      
      for (const exercise of workout.current) {
        if (exercise.reps[0] === 0) 
          totalXP.current += addXP(true, exercise);
        else
          totalXP.current += addXP(false, exercise);
      }

    } 
    
    
    
    setGoToNextPage(false)
  }
}, [goToNextPage]) 

  function handleFinishWorkoutButton(workout: ExerciseSet[], userID: string | null, date: string, totalXP: number, navigation: NavigationProp<any, any> ): void {    
    if (week !== null) {
      addWorkout(userID, date, workout, totalXP, week );
      navigation.navigate("Log");
    }
  }

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        {
          loadingExercises || loadingUser
            ? <ActivityIndicator />
            : !endOfWorkout
              ?
                <ScrollView>
                  {workoutComponents[currentIndex]}
                </ScrollView>
              : <View>
                  <Text style={styles.text}>Congrats</Text>
                  <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => handleFinishWorkoutButton(workout.current, userID, new Date().toDateString(), totalXP.current, navigation)}>
                      <Text style={globalStyles.buttonText}>Next</Text>
                  </Pressable>
                </View>
        }
      </View>
    </ImageBackground>
  )
}

export default CurrentExercise

const styles = StyleSheet.create({
  text:{
      alignSelf: 'center',
      fontSize: 18,
      color: "#fff",
      textTransform: 'uppercase',
      fontWeight: "600",
      paddingVertical: 10,
  },
});