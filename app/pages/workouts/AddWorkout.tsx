import { ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../../components/SelectMenu'
import UserContext from '../../contexts/UserContext'
import { Exercise, ExerciseSet, RouterProps } from '../../types and interfaces/types'
import { backgroundImage, globalStyles } from '../../assets/styles'
import WeekContext from '../../contexts/WeekContext'
import { workoutsStyles } from './styles'
import {  ExerciseLogType, SelectOption } from './types'
import {  finishExercise} from './workoutsFunction'
import { collection, Unsubscribe, onSnapshot, query, where } from 'firebase/firestore'
import { FIRESTORE_DB } from '../../../FirebaseConfig'

type RouteParamsTypes = {
  date: string;
}

const AddWorkout = ( {navigation, route}: RouterProps) => {
  const userID = useContext(UserContext);
  const week = useContext(WeekContext);


  const { date }  = route?.params as RouteParamsTypes;

  const [allExercises, setAllExercises] = useState<SelectOption[]>();
  const [currentExercise, setCurrentExercise] = useState<SelectOption>();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [restTime, setRestTime] = useState("");
  const [sets, setSets] = useState<ExerciseLogType>({
    exercise : [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  });
  const [isEnabled, setIsEnabled] =  useState(false);
  const [side, setSide] = useState<"both" | "left" | "right">("both")

  function toggleSwitch(): void {
    try {
      if (isEnabled)
          setSide('left');
      else
          setSide('right')
      setIsEnabled(previousState => !previousState);
    } catch (error: any) {
      alert(`Error: Couldn't toggle switch: ${error}`)
    }
  };

  function addSet (): void {
    try {
      const numericData = convertFieldsToNumeric(parseFloat(weight), parseFloat(reps), parseFloat(time), parseFloat(restTime));
      if (currentExercise === undefined){
        alert("Error: Please select an exercise");
        return;
      }
      validateData(currentExercise, parseFloat(reps), parseFloat(time), parseFloat(restTime));
      
      setSets((prevSets) => ({
        ...prevSets,
        exercise: [...prevSets.exercise, currentExercise.label],
        weights: [...prevSets.weights, numericData.weight],
        reps: [...prevSets.reps, numericData.rep],
        times: [...prevSets.times, numericData.time],
        restTimes: [...prevSets.restTimes, numericData.restTime*60],
        sides: [...prevSets.sides, side],
      }));
      resetInputFields();
    } catch (error: any) {
      alert(`Error: Couldn't add set: ${error}`)
    }
    
  };


  function convertFieldsToNumeric(weight:number, reps: number, time: number, restTime: number): ExerciseSet {
    if (Number.isNaN(weight))
      return {
        weight: 0,
        rep: reps,
        time: time,
        restTime: restTime
      }
    if (Number.isNaN(reps))
      return {
        weight: weight,
        rep: 0,
        time: time,
        restTime: restTime
      }      
    if (Number.isNaN(time))
      return {
        weight: weight,
        rep: reps,
        time: 0,
        restTime: restTime
      }      
    if (Number.isNaN(restTime))
      return {
        weight: weight,
        rep: reps,
        time: time,
        restTime: 0
      }
    return {
      weight: weight,
      rep: reps,
      time: time,
      restTime: restTime

    }
  }
  
  function validateData(currentExercise:SelectOption, reps: number, time: number, restTime: number): void {
    if (!currentExercise.isometric && Number.isNaN(reps))
      throw new Error("Repetition number is required for non-isometric exercises");
    if (!currentExercise.isometric && reps < 0)
      throw new Error("Repetition number must be a positive number");
    if (currentExercise.isometric && Number.isNaN(time) )
      throw new Error("Time is required for non-isometric exercises");
    if (currentExercise.isometric && time < 0)
      throw new Error("Time must be a positive number");
    if (restTime < 0)
      throw new Error("Rest time must be a positive number");
  }

  function resetInputFields() {
    setWeight("");
    setReps("");
    setTime("");
    setRestTime("");
  }
  function resetAllFields() {
    setAllExercises([]);
    setCurrentExercise(undefined);
    setIsEnabled(false);
    setReps("");
    setRestTime("");
    setSets({
      exercise : [],
      weights: [],
      reps: [],
      times: [],
      restTimes: [],
      sides: []
    });
    setSide("both");
    setTime("");
    setWeight("");
  }

  
  function getAvailableExercises (userID: string | null, callback: Function): Unsubscribe | undefined {
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
        alert(`Error: Couldn't fetch exercises: ${error}`)
    }
};

  
  
  useEffect(() => {
    const unsubscribeFromAvailableExercises = getAvailableExercises(userID, (exercises: Exercise[]) => {
      const exerciseData: SelectOption[] = [];
        exercises.forEach((exercise) => {
          exerciseData.push({
            label: exercise.name,
            value: exercise.name,
            unilateral: exercise.unilateral,
            isometric: exercise.isometric,
          });
        });

        setAllExercises(exerciseData);
    });
  
    return () => {
      if (unsubscribeFromAvailableExercises !== undefined)
        unsubscribeFromAvailableExercises();
      resetAllFields();

    };
  }, [userID]);
  

  useEffect(() => {
    if (currentExercise !== undefined && currentExercise.unilateral)
      setSide("left");
    else if (currentExercise !== undefined && currentExercise.unilateral)
      setSide("both");
  }, [currentExercise])
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
    <ScrollView contentContainerStyle={workoutsStyles.container}>
        <Text style={workoutsStyles.label}>Add new execise</Text>
        <View style={styles.selectMenuContainer} >
          <SelectMenu
            data={allExercises || []}
            setSelectedValue={ setCurrentExercise }
            title="Exercise"
          />
        </View>
        {allExercises
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
              <Pressable style={workoutsStyles.button} onPress={addSet}>
                  <Text style={globalStyles.buttonText}>Add set</Text>
              </Pressable>
              <Pressable style={workoutsStyles.button} onPress={() => finishExercise(sets, userID, new Date(date), week, navigation, setSets)}>
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

