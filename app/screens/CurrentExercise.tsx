import { ActivityIndicator, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../contexts/UserContext';
import { getExercisesByFocus, getUser } from '../functions/firebaseFunctions';
import { Exercise, ExerciseSet, MuscleGroups } from '../types and interfaces/types';
import Set from '../components/Set';
import Rest from '../components/Rest';
import { addXP, calculateNumberOfSet, chooseExercises, handleFinishWorkoutButton } from '../functions/otherFunctions';
import { NavigationProp } from '@react-navigation/native';
import { backgroundImage, globalStyles } from '../assets/styles';
import WeekContext from '../contexts/WeekContext';


type RouterProps = {
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
      else if (currentIndex === workoutComponents.length-1){
        setEndofWorkout(true)
        workout.current.push(currentExercise.current)       

        
      }    

      const newExercise: ExerciseSet = {
        exercise: [],
        reps: [],
        restTimes: [],
        sides: [],
        times: [],
        weights: []
      };
      for (let i = 0; i < currentExercise.current.exercise.length; i++) {
        if (currentExercise.current.exercise[i] !== currentExercise.current.exercise[i-1] && i > 0) {          
          console.log(newExercise);
          workout.current.push(newExercise)             
          console.log(workout.current);
     
          currentExercise.current.exercise.splice(0, currentExercise.current.exercise.length-1)
          currentExercise.current.reps.splice(0, currentExercise.current.reps.length-1)
          currentExercise.current.restTimes.splice(0, currentExercise.current.restTimes.length-1)
          currentExercise.current.sides.splice(0, currentExercise.current.sides.length-1)
          currentExercise.current.times.splice(0, currentExercise.current.times.length-1)
          currentExercise.current.weights.splice(0, currentExercise.current.weights.length-1)        
        
          console.log(currentExercise.current);
          
        }
        else{
          
          newExercise.exercise.push(currentExercise.current.exercise[i])
          newExercise.reps.push(currentExercise.current.reps[i])
          newExercise.restTimes.push(currentExercise.current.restTimes[i])
          newExercise.sides.push(currentExercise.current.sides[i])
          newExercise.times.push(currentExercise.current.times[i])
          newExercise.weights.push(currentExercise.current.weights[i])
        }
      
      }
             
      for (const exercise of workout.current) {
        if (exercise.reps[0] === 0) 
          totalXP.current += addXP(true, exercise);
        else
          totalXP.current += addXP(false, exercise);
      }

 
      
      
      
      setGoToNextPage(false)
    }
  }, [goToNextPage]) 



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
                  <Text style={globalStyles.label}>Congratulations!</Text>
                  <Text style={globalStyles.label}>You completed the workout.</Text>
                  <Pressable style={[globalStyles.button, {width: 200}]} onPress={() =>{week !== null && handleFinishWorkoutButton(workout.current, userID, new Date().toDateString(), totalXP.current, navigation, week)}}>
                      <Text style={globalStyles.buttonText}>Go to homepage</Text>
                  </Pressable>
                </View>
        }
      </View>
    </ImageBackground>
  )
}

export default CurrentExercise