import { ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import SelectMenu from '../../components/SelectMenu'
import UserContext from '../../contexts/UserContext'
import { Exercise, RouterProps, Sets } from '../../types and interfaces/types'
import { backgroundImage, globalStyles } from '../../assets/styles'
import WeekContext from '../../contexts/WeekContext'
import { workoutsStyles } from './styles'
import {  addXP, finishExercise, validateData} from './workoutsFunction'
import { collection, Unsubscribe, onSnapshot, query, where } from 'firebase/firestore'
import { FIRESTORE_DB } from '../../../FirebaseConfig'

type RouteParamsTypes = {
  date: string;
}

const AddWorkout = ( {navigation, route}: RouterProps) => {
  const userID = useContext(UserContext);
  const week = useContext(WeekContext);


  
  const { date }  = route?.params as RouteParamsTypes;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>();

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [restTime, setRestTime] = useState("");
  const [isEnabled, setIsEnabled] =  useState(false);
  const [side, setSide] = useState<"both" | "left" | "right">("both");
  const [sets, setSets] = useState<Sets>({
    exercise : [],
    dates: [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  });
  const totalXP = useRef(0);

  useEffect(() => {
    const unsubscribeFromAvailableExercises = getAvailableExercises((exercises: Exercise[]) => {
      const exerciseData: Exercise[] = [];
        exercises.forEach((exercise) => {
          exerciseData.push({
            label: exercise.label,
            value: exercise.value,
            musclesWorked: exercise.musclesWorked,
            hidden: exercise.hidden,
            unilateral: exercise.unilateral,
            isometric: exercise.isometric,
          });
        });

        setExercises(exerciseData);
    });
  
    return () => {
      if (unsubscribeFromAvailableExercises !== undefined)
        unsubscribeFromAvailableExercises();
    };
  }, [userID]);

  useEffect(() => {
    if (currentExercise?.unilateral)
      setSide("left");
    else
      setSide("both");
    
  }, [currentExercise])

  function getAvailableExercises ( callback: Function): Unsubscribe | undefined {
    try {
        const exercises: Exercise[] = [];
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDocRef = usersSnapshot.docs[0].ref;
                const exercisesCollectionRef = collection(userDocRef, "exercises");
                const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false));
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
            }
            else 
                throw new Error("user doesn't exist");
        })
        return unsubscribeFromUsers;
    } catch (error: any) {
        alert(`Error: Couldn't fetch exercises: ${error}`)
    }
  }

  function toggleSwitch(): void {
    try {
      if (isEnabled) setSide('left');
      else setSide('right');
      
      setIsEnabled(previousState => !previousState);
    } catch (error: any) {
      alert(`Error: Couldn't toggle switch: ${error}`)
    }
  }

  
  function addSet (currentExercise: Exercise, weight: string, reps: string, time: string, restTime: string, side: string): void {
    try {
      const numericData = {
        exercise: currentExercise.label,
        reps: parseFloat(reps) | 0,
        restTime: parseFloat(restTime) | 0,
        side: side as "both" | "left" | "right",
        time: parseFloat(time) | 0,
        weight: parseFloat(weight) | 0,
      }
      validateData(currentExercise.isometric, numericData.reps, numericData.time, numericData.restTime);                        
      
      setSets((prevSets) => ({
        ...prevSets,
        exercise: [...prevSets.exercise, currentExercise.label],
        weights: [...prevSets.weights, numericData.weight],
        reps: [...prevSets.reps, numericData.reps],
        times: [...prevSets.times, numericData.time],
        restTimes: [...prevSets.restTimes, numericData.restTime*60],
        sides: [...prevSets.sides, side as "both" | "left" | "right"],
      }));
      totalXP.current += addXP(currentExercise.isometric, numericData);      
      resetInputFields();
    } catch (error: any) {
      alert(`Error: Couldn't add set: ${error}`)
    }
    
  }

  
  function resetInputFields(): void {
    setWeight("");
    setReps("");
    setTime("");
    setRestTime("");
  }

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
    <ScrollView contentContainerStyle={workoutsStyles.container}>
      <Text style={workoutsStyles.label}>Add new execise</Text>
      <View style={styles.selectMenuContainer} >
        <SelectMenu
          data={exercises || []}
          setSelectedValue={ setCurrentExercise }
          title="Exercise"
        />
      </View>
        {exercises
        && <View>
            {currentExercise !== undefined && currentExercise.unilateral
              ? <View style={styles.gridContainer}>
                  <Text style={workoutsStyles.text}>{side} side</Text>
                  <Switch
                    trackColor={{ false: "#808080", true: "#FFF" }}
                    ios_backgroundColor="#3E3E3E"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              :<></>
            }
            { currentExercise !== undefined 
              ? <>
                  <Text style={workoutsStyles.text}>weight (kg)</Text>
                  <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={weight}
                    placeholder="Weight (kg)"
                    autoCapitalize='none'
                    onChangeText={(text) => setWeight(text)}
                  />
                </>
              : <></>
              }
            {currentExercise !== undefined && !currentExercise.isometric
              ? <>
                  <Text style={workoutsStyles.text}>reps</Text>
                  <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={reps}
                    placeholder="Reps"
                    autoCapitalize='none'
                    onChangeText={(text) => setReps(text)}
                  />
                </>
              : <></>
            }
            { currentExercise !== undefined
              ? <>
                  <Text style={workoutsStyles.text}>time (seconds)</Text>
                  <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={time}
                    placeholder="Time (in seconds)"
                    autoCapitalize='none'
                    onChangeText={(text) => setTime(text)}
                  />
                </>
              : <></>
            }
            { currentExercise !== undefined

              ? <>
                  <Text style={workoutsStyles.text}>Rest time (minutes)</Text>
                  <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={restTime}
                    placeholder="Rest time (in minutes)"
                    autoCapitalize='none'
                    onChangeText={(text) => setRestTime(text)}
                  />      
                </> 
                : <></>
          }
            <View style={styles.gridContainer}>
              <Pressable style={workoutsStyles.button} onPress={() => { currentExercise ? addSet(currentExercise, weight, reps, time, restTime, side) : alert("Error: Please select an exercise") }}>
                  <Text style={globalStyles.buttonText}>Add set</Text>
              </Pressable>
              <Pressable style={workoutsStyles.button} onPress={() => {sets.exercise.length > 0 ? finishExercise(sets, userID, new Date(date), week, totalXP.current, navigation) : alert("Error: Not enough sets")}}>
                  <Text style={globalStyles.buttonText}>Finish</Text>
              </Pressable>
            </View>
              <Text style={workoutsStyles.text}>Total sets: {sets.exercise.length}</Text>
          </View>
        }
      </ScrollView>
    </ImageBackground>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
  gridContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginVertical: 20,
    justifyContent: 'center'
  },
  selectMenuContainer: {
    backgroundColor: "#fff",
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 4, 
  },
});

