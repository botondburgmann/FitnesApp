import { ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import { addSet, getAvailableExercises } from '../functions/databaseQueries'
import UserContext from '../contexts/UserContext'
import {ExerciseSelectOption, ExerciseSet } from '../types and interfaces/types'
import { addXP, handleAddButton } from '../functions/otherFunctions'
import { NavigationProp } from '@react-navigation/native'
import { backgroundImage, globalStyles } from '../assets/styles'

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
};

const AddWorkout = ({ route, navigation }: RouterProps) => {
  const userID = useContext(UserContext);


  const { date } = route?.params;

  const [allExercises, setAllExercises] = useState<ExerciseSelectOption[]>();
  const [currentExercise, setCurrentExercise] = useState<ExerciseSelectOption>({
    label: "",
    value: "",
    unilateral: undefined,
    isometric: undefined
  });
  const [selectedExercises, setSelectedExercises] = useState<ExerciseSelectOption[]>([]);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [restTime, setRestTime] = useState("");
  const [sets, setSets] = useState<ExerciseSet>({
    exercise : [],
    weights: [],
    reps: [],
    times: [],
    restTimes: [],
    sides: []
  });
  const [isEnabled, setIsEnabled] =  useState(false);
  const [side, setSide] = useState("both")


  useEffect(() => {
    const unsubscribe = getAvailableExercises(userID, (exercises) => {
      const exerciseData = [];
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
      unsubscribe();
      setAllExercises([]);
    };
  }, []);
  
  


  useEffect(() => {
    if (currentExercise.unilateral)
      setSide("left");
    else if (!currentExercise.unilateral)
      setSide("both");
  }, [currentExercise])
  

  function toggleSwitch(): void {
    if (isEnabled)
        setSide('left');
    else
        setSide('right')
    setIsEnabled(previousState => !previousState);
  }

  function handleFinishButton(selectedExercises, sets: ExerciseSet): void {
    if (sets.exercise.length === 0)
      throw new Error("Not enough data");
    else{
        let experience = 0;
        for (const exercise of selectedExercises) {
          if (exercise.isometric)
            experience = addXP(true, sets);
          else
            experience = addXP(false, sets);
        }
        
        addSet(userID, date, sets, experience);
      setSets({
        exercise : [],
        weights: [],
        reps: [],
        times: [],
        restTimes: [],
        sides: []
      });
      setSelectedExercises([]);
      navigation.navigate("Log")
    }
  }

  


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
    <ScrollView contentContainerStyle={globalStyles.container}>
        <Text style={styles.label}>Add new execise</Text>
        <View style={styles.selectMenuContainer} >
          <SelectMenu
            data={allExercises || []}
            setSelectedValue={ setCurrentExercise }
          />
        </View>
        {allExercises
        && <View>
            { currentExercise.unilateral
              ? <View style={styles.gridContainer}>
                  <Text style={styles.text}>{side} side</Text>
                  <Switch
                    trackColor={{ false: "#808080", true: "#fff" }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              :<></>
            }
            <Text style={styles.text}>weight (kg)</Text>
            <TextInput
              keyboardType='numeric'
              style={globalStyles.input}
              value={weight}
              placeholder="Weight"
              autoCapitalize='none'
              onChangeText={(text) => setWeight(text)}
            />
            {!currentExercise.isometric
              ? <>
                <Text style={styles.text}>reps</Text>
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
            <Text style={styles.text}>time (seconds)</Text>
            <TextInput
              keyboardType='numeric'
              style={globalStyles.input}
              value={time}
              placeholder="Time (in seconds)"
              autoCapitalize='none'
              onChangeText={(text) => setTime(text)}
            />
            <Text style={styles.text}>Rest time (seconds)</Text>
            <TextInput
              keyboardType='numeric'
              style={globalStyles.input}
              value={restTime}
              placeholder="Rest time (in seconds)"
              autoCapitalize='none'
              onChangeText={(text) => setRestTime(text)}
            />
            <View style={styles.gridContainer}>
              <Pressable style={[globalStyles.button, { width: 100}]} onPress={() => handleAddButton(parseInt(time), setTime, parseFloat(reps), setReps,
                                                                              parseInt(restTime), setRestTime, side, setSide,parseFloat(weight), setWeight,
                                                                              currentExercise, setCurrentExercise, sets, setIsEnabled, selectedExercises)}>
                  <Text style={globalStyles.buttonText}>Add set</Text>
              </Pressable>
              <Pressable style={[globalStyles.button, { width: 100}]} onPress={() => handleFinishButton(selectedExercises, sets)}>
                  <Text style={globalStyles.buttonText}>Finish</Text>
              </Pressable>
            </View>
              <Text style={styles.text}>Total sets: {sets.exercise.length}</Text>
          </View>
        }
      </ScrollView>
    </ImageBackground>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
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
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginVertical: 20,
    justifyContent: 'center'
  },
  label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginVertical: 10,
    textAlign: 'center',
    lineHeight: 40
  },
  selectMenuContainer: {
    backgroundColor: "#fff",
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 4, 
},
});