import { ActivityIndicator, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import {  getUser } from '../../functions/firebaseFunctions';
import {  ActivityLevelOption, Exercise, RouterProps, Sets } from '../../types and interfaces/types';
import Set from './components/Set';
import Rest from './components/Rest';
import { backgroundImage, globalStyles } from '../../assets/styles';
import WeekContext from '../../contexts/WeekContext';
import { WorkoutTypes } from './types';
import { addXP, finishExercise } from './workoutsFunction';
import { Unsubscribe } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';


const CurrentExercise = ({ route, navigation }: RouterProps) => {
  const userID = useContext(UserContext)
  const week = useContext(WeekContext)
  const { workoutType, focus } = route?.params;
  const muscles: WorkoutTypes  ={
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
  const [activityLevel, setActivityLevel] = useState<ActivityLevelOption>({label: 'Beginner', value: 'beginner'});
  const [loadingUser, setLoadingUser] = useState(true);
  const [workoutComponents, setWorkoutComponents] = useState<React.JSX.Element[]>([]);
  const workout = useRef<Sets[]>([]);
  const [endOfWorkout, setEndofWorkout] = useState(false);
  const totalXP = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goToNextPage, setGoToNextPage] = useState(false);

  const currentExercise = useRef<Sets>({
    exercise : [],
    dates: [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  })


function getExercisesByFocus (callback: Function): Unsubscribe | undefined {
    try {
      const exercises: Exercise[] = [];
      const usersCollectionRef = collection(FIRESTORE_DB, "Users");
      const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
      
      const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
        if (usersSnapshot.empty) throw new Error("User doesn't exist");
        
        const userDocRef = usersSnapshot.docs[0].ref;
        const exercisesCollectionRef = collection(userDocRef, "exercises")      
        const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false), where("musclesWorked", "array-contains-any", muscles[workoutType]));
        const unsubscribeFromExercises = onSnapshot(exercisesQuery, exercisesSnapshot => {
          exercisesSnapshot.docs.forEach(exerciseDoc => {
            exercises.push({
              hidden: exerciseDoc.data().hidden,
              isometric: exerciseDoc.data().isometric,
              label: exerciseDoc.data().name,
              value: exerciseDoc.data().name.toLowerCase(),
              musclesWorked: exerciseDoc.data().musclesWorked,
              unilateral: exerciseDoc.data().unilateral
            })
          }) 
          callback(exercises);                   
        })
        
        unsubscribeFromExercises;

      })
      return unsubscribeFromUsers;   
    } 
    catch (error: any) {
        alert(`Error: couldn't fetch exercises for ${[...muscles[workoutType]]}: ${error.message}`);
    }
}


async function addWorkout (): Promise<void> {
  try {
    for (const set of workout.current) 
      await finishExercise(set, userID, new Date(), week, navigation)
    navigation.navigate("Log");
    } 
  catch (error: any) {
    alert(`Error: Couldn't add workout: ${error}`)
  }  
}

function shuffleArray (array: any[]): any[] {
    const shuffledArray = [...array];
  
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
  
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    return shuffledArray;
}

function chooseExercises (exercises: Exercise[]): Exercise[] {    
    const shuffledExercises: Exercise[] = shuffleArray(exercises);
    const selectedExercises: Exercise[] = [];
    switch (activityLevel.value) {
      case "beginner":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && selectedExercises.length < 3)
            selectedExercises.push(exercise);
        break;
      case "intermediate":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && selectedExercises.length < 3)
            selectedExercises.push(exercise);
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length === 1 && selectedExercises.length < 5)
            selectedExercises.push(exercise);
        break;
      case "advanced":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && selectedExercises.length < 3)
            selectedExercises.push(exercise);
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length === 1 && selectedExercises.length < 6)
            selectedExercises.push(exercise);
        break;
      default:
        throw new Error("invalid activityLevel");
      }      
      return selectedExercises;
}

function calculateNumberOfSet (focus:string, activityLevel: string): number {
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
      throw new Error("invalid activity level");
  }
  return numberOfSet;
}
  useEffect(() => {
    const unsubscribeFromGetExerciseByFocus = getExercisesByFocus((exercises: React.SetStateAction<Exercise[]>) => {
      setExercises(exercises);
      setLoadingExercises(false);
    })
  
    return () => {
      if (unsubscribeFromGetExerciseByFocus !== undefined) unsubscribeFromGetExerciseByFocus();
    }
  }, [userID, workoutType]);
 
  useEffect(() => {
    const unsubscribe = getUser(userID, (user: { activityLevel: React.SetStateAction<string>; }) => {
      user.activityLevel === "beginner" 
        ? setActivityLevel({label: 'Beginner', value: 'beginner'})
        : user.activityLevel === "intermediate"
        ? setActivityLevel({label: 'Intermediate', value: 'intermediate'})
        : setActivityLevel({label: 'Advanced', value: 'advanced'})
      setLoadingUser(false);
    })
    
    return () => {
      if (unsubscribe !== undefined) unsubscribe();
    }
  }, [userID]);
   

  useEffect(() => {
    if (!loadingUser && !loadingExercises) {
      const selectedExercises: Exercise[] = chooseExercises(exercises);
      const numberOfSets = calculateNumberOfSet(focus, activityLevel.value);
      const workoutComponents: React.JSX.Element[] = []
    
      for (let i = 0; i < selectedExercises.length; i++) {
        for (let j = 0; j < numberOfSets; j++) {
          workoutComponents.push(<Set  
            key={`set-${selectedExercises[i].value}-${j}`} 
            exercise={selectedExercises[i]} 
            focus={focus}
            setGoToNextPage={setGoToNextPage}
            currentExercise={currentExercise.current}
          />)          
          workoutComponents.push(<Rest 
            key={`rest-${selectedExercises[i].value}-${j}`} 
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
      if (currentIndex < workoutComponents.length-1) setCurrentIndex(currentIndex+1);
      else if (currentIndex === workoutComponents.length-1){
        setEndofWorkout(true)
        workout.current.push(currentExercise.current)
      }    

      const newExercise: Sets = {
        dates: [],
        exercise: [],
        reps: [],
        restTimes: [],
        sides: [],
        times: [],
        weights: []
      };

      for (let i = 0; i < currentExercise.current.exercise.length; i++) {
        if (currentExercise.current.exercise[i] !== currentExercise.current.exercise[i-1] && i > 0) {          
          workout.current.push(newExercise)                            
          currentExercise.current.exercise.splice(0, currentExercise.current.exercise.length-1)
          currentExercise.current.reps.splice(0, currentExercise.current.reps.length-1)
          currentExercise.current.restTimes.splice(0, currentExercise.current.restTimes.length-1)
          currentExercise.current.sides.splice(0, currentExercise.current.sides.length-1)
          currentExercise.current.times.splice(0, currentExercise.current.times.length-1)
          currentExercise.current.weights.splice(0, currentExercise.current.weights.length-1)               
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
        let experience;
        
        for (let i = 0; i < exercise.reps.length; i++) {
          if (exercise.reps[i] === 0) experience = addXP(true, exercise);
          else experience = addXP(false, exercise); 
        }
        
        if (experience !== undefined) totalXP.current += experience 
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
                  <Pressable style={[globalStyles.button, {width: 200}]} onPress={async() => await addWorkout()}>
                      <Text style={globalStyles.buttonText}>Go to homepage</Text>
                  </Pressable>
                </View>
        }
      </View>
    </ImageBackground>
  )
}

export default CurrentExercise