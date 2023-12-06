import { ActivityIndicator, ImageBackground, Pressable, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import {  getUser } from '../../functions/firebaseFunctions';
import {  ActivityLevelOption, Exercise, RouterProps, Sets, SingleSet } from '../../types and interfaces/types';
import Set from './components/Set';
import Rest from './components/Rest';
import { backgroundImage, globalStyles } from '../../assets/styles';
import WeekContext from '../../contexts/WeekContext';
import { WorkoutTypes } from './types';
import { Unsubscribe } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { addXP, finishExercise } from './workoutsFunction';


const CurrentExercise = ({ route, navigation }: RouterProps) => {
  const userID = useContext(UserContext)
  const week = useContext(WeekContext)
  const { workoutType, focus } = route?.params;
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [activityLevel, setActivityLevel] = useState<ActivityLevelOption>({label: 'Beginner', value: 'beginner'});
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [numberOfSets, setNumberOfSets] = useState<number>();
  const currentSetIndex = useRef(0);
  const [completedSet, setCompletedSet] = useState(false);
  const [endOfWorkout, setEndofWorkout] = useState(false);
  const totalXP = useRef(0);
  const sets = useRef<Sets>({
    exercise : [],
    dates: [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  })

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
  
  useEffect(() => {
    const unsubscribeFromGetExerciseByFocus = getExercisesByFocus((exercises: Exercise[]) => {
      setExercises(exercises);
      setLoadingExercises(false);
    })
    const unsubscribeFromUsers = getUser(userID, (user: { activityLevel: string; }) => {
      user.activityLevel === "beginner" 
        ? setActivityLevel({label: 'Beginner', value: 'beginner'})
        : user.activityLevel === "intermediate"
        ? setActivityLevel({label: 'Intermediate', value: 'intermediate'})
        : setActivityLevel({label: 'Advanced', value: 'advanced'})
      setLoadingUser(false);
    })
  
    return () => {
      if (unsubscribeFromGetExerciseByFocus !== undefined) unsubscribeFromGetExerciseByFocus();
      if (unsubscribeFromUsers !== undefined) unsubscribeFromUsers();

    }
  }, [userID, workoutType]);
  
  
  
  useEffect(() => {
    if (numberOfSets && numberOfSets >  0) {
      const selectedExercises: Exercise[] = chooseExercises(exercises);      

      setSelectedExercises(selectedExercises.flatMap((element) => Array(numberOfSets).fill(element)));
    }      
    
  }, [numberOfSets])

  useEffect(() => {
    if (!loadingExercises && !loadingUser) {
      const numberOfSets = calculateNumberOfSet(focus, activityLevel.value);
      setNumberOfSets(numberOfSets);
    }
  }, [loadingExercises, loadingUser])
  
  useEffect(() => {
    if (completedSet) {
      if (currentSetIndex.current < selectedExercises.length-1){  
        currentSetIndex.current++;
      }
      else
        setEndofWorkout(true);
   }
  }, [completedSet]) 
  


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
    
    const numberOfExercises = {
      compound: 0,
      isolation: 0
    };
    if (activityLevel.value === "beginner" && focus === "Strength")
      numberOfExercises.compound = Math.floor(Math.random() * (3 - 2 + 1) + 2);
    else if (activityLevel.value === "intermediate" && focus === "Strength"){
      numberOfExercises.compound = Math.floor(Math.random() * (3 - 2 + 1) + 2);
      numberOfExercises.isolation = numberOfExercises.compound === 2 ? 2 : 1;
    }
    else if (activityLevel.value === "advanced" && focus === "Strength"){
      numberOfExercises.compound = Math.floor(Math.random() * (4 - 3 + 1) + 3);
      numberOfExercises.isolation = numberOfExercises.compound === 3 ? 2 : 1;
    }
    else if (activityLevel.value === "beginner" && focus === "Hypertrophy"){
      numberOfExercises.compound = 1;
      numberOfExercises.isolation = Math.floor(Math.random() * (3 - 2 + 1) + 2);
    }
    else if (activityLevel.value === "intermediate" && focus === "Hypertrophy"){
      numberOfExercises.compound = 1;
      numberOfExercises.isolation = Math.floor(Math.random() * (4 - 3 + 1) + 3);
    }
    else if (activityLevel.value === "advanced" && focus === "Hypertrophy"){
      numberOfExercises.compound = 2;
      numberOfExercises.isolation = Math.floor(Math.random() * (4 - 3 + 1) + 3);
    }

    for (const exercise of shuffledExercises)
      if (exercise.musclesWorked.length > 1 && selectedExercises.length < numberOfExercises.compound)
        selectedExercises.push(exercise);
    for (const exercise of shuffledExercises)
      if (exercise.musclesWorked.length === 1 && selectedExercises.length < numberOfExercises.isolation)
        selectedExercises.push(exercise);       
      
      return selectedExercises;
}

function calculateNumberOfSet (focus:string, activityLevel: string): number {
  if (activityLevel === "beginner") return Math.floor(Math.random() * (3 - 2 + 1) + 2);
  if (activityLevel === "intermedite") return Math.floor(Math.random() * (4 - 3 + 1) + 3);
  return focus === "strength" ?  Math.floor(Math.random() * (6 - 4 + 1) + 4): Math.floor(Math.random() * (5 - 4 + 1) + 4);
}
   
function finishWorkout() {
  const lastSet: SingleSet = {
    exercise: sets.current.exercise[sets.current.exercise.length-1],
    reps: sets.current.reps[sets.current.reps.length-1],
    restTime: sets.current.restTimes[sets.current.restTimes.length-1],
    side: sets.current.sides[sets.current.sides.length-1],
    time: sets.current.times[sets.current.times.length-1],
    weight: sets.current.weights[sets.current.weights.length-1]
  }
  if (selectedExercises[currentSetIndex.current].unilateral) {
    totalXP.current += addXP(selectedExercises[currentSetIndex.current].isometric, lastSet);
    totalXP.current += addXP(selectedExercises[currentSetIndex.current].isometric, lastSet);
  }
  else
    totalXP.current += addXP(selectedExercises[currentSetIndex.current].isometric, lastSet);

  finishExercise(sets.current, userID, new Date(), week, totalXP.current );
  totalXP.current = 0;
  navigation.navigate("Log");
}

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        {
          selectedExercises.length === 0
            ? <ActivityIndicator />
            : !endOfWorkout
              ? !completedSet ?
                  <Set         
                    exercise={selectedExercises[currentSetIndex.current]} 
                    focus={focus}
                    setCompletedSet={setCompletedSet}
                    sets={sets.current}
                  />
                :
                  <Rest 
                    exercise={selectedExercises[currentSetIndex.current]} 
                    setCompletedSet={setCompletedSet}
                    sets={sets}
                    isLastSetOfExercise={currentSetIndex.current < selectedExercises.length-1 && selectedExercises[currentSetIndex.current].value !== selectedExercises[currentSetIndex.current+1].value}
                    totalXP={totalXP}

                  />
              : <View>
                  <Text style={globalStyles.label}>Congratulations!</Text>
                  <Text style={globalStyles.label}>You completed the workout.</Text>
                  <Pressable style={[globalStyles.button, {width: 200}]} onPress={finishWorkout}>
                      <Text style={globalStyles.buttonText}>Go to homepage</Text>
                  </Pressable>
                </View>
        }
      </View>
    </ImageBackground>
  )
}

export default CurrentExercise