import { ActivityIndicator, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import {  getUser } from '../../functions/firebaseFunctions';
import {  Exercise, RouterProps } from '../../types and interfaces/types';
import Set from './components/Set';
import Rest from './components/Rest';
import { backgroundImage, globalStyles } from '../../assets/styles';
import WeekContext from '../../contexts/WeekContext';
import { ExerciseLog, WorkoutTypes } from './types';
import { addXP, calculateNumberOfSet, finishExercise } from './workoutsFunction';
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
  const [activityLevel, setActivityLevel] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [workoutComponents, setWorkoutComponents] = useState<React.JSX.Element[]>([]);
  const workout = useRef<ExerciseLog[]>([]);
  const [endOfWorkout, setEndofWorkout] = useState(false);
  const totalXP = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goToNextPage, setGoToNextPage] = useState(false);

  const currentExercise = useRef<ExerciseLog>({
    exercise : [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  })

  function handleFinishWorkoutButton (): void  {    
    try {
      if (week !== null) {      
        addWorkout();
        navigation.navigate("Log");
      }
    } catch (error) {
      alert(`Error: Couldn't finish workout: ${error}`)
    }
  }

  function getExercisesByFocus (userID: string | null, musclesWorked: string[], callback: Function): Unsubscribe | undefined {
    try {
        const exercises: Exercise[] = [];
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDocRef = usersSnapshot.docs[0].ref;
                const exercisesCollectionRef = collection(userDocRef, "exercises");
                const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false), where("musclesWorked", "array-contains-any", musclesWorked));
                const unsubscribeFromExercises = onSnapshot(exercisesQuery, exercisesSnapshot => {
                    exercisesSnapshot.docs.forEach(exerciseDoc => {
                        exercises.push({
                            hidden: exerciseDoc.data().hidden,
                            isometric: exerciseDoc.data().isometric,
                            name: exerciseDoc.data().name,
                            musclesWorked: exerciseDoc.data().musclesWorked,
                            unilateral: exerciseDoc.data().unilateral
                        })
                    }) 
                    callback(exercises);                   
                })
                unsubscribeFromExercises;
            }
            else 
                throw new Error("user doesn't exist");
        })
        return unsubscribeFromUsers;
        
    } catch (error: any) {
        alert(`Error: couldn't fetch exercises for ${[...musclesWorked]}: ${error.message}`);
    }
};


  async function addWorkout (): Promise<void> {
    try {
      for (const set of workout.current) 
        finishExercise(set, userID, new Date(), week, navigation)
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
};
  function chooseExercises (): Exercise[] {    
    const shuffledExercises: Exercise[] = shuffleArray(exercises);
    const selectedExercises: Exercise[] = [];
    switch (activityLevel) {
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
};
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
      if (unsubscribe !== undefined) 
        unsubscribe();
    }
  }, [userID]);
   

  useEffect(() => {
    if (!loadingUser && !loadingExercises) {
      const selectedExercises: Exercise[] = chooseExercises();
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

      const newExercise: ExerciseLog = {
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
        let experience = addXP(exercise.exercise[0].isometric, exercise);
        if (experience !== undefined)
          totalXP.current += experience ;
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
                  <Pressable style={[globalStyles.button, {width: 200}]} onPress={() =>{week !== null && handleFinishWorkoutButton()}}>
                      <Text style={globalStyles.buttonText}>Go to homepage</Text>
                  </Pressable>
                </View>
        }
      </View>
    </ImageBackground>
  )
}

export default CurrentExercise