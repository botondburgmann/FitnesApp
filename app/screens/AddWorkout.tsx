import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import { addSet, getExercises, getUsersExercises } from '../functions/databaseQueries'
import UserContext from '../contexts/UserContext'
import useFetch from '../hooks/useFetch'
import { NavigationProp } from '@react-navigation/native'
import { Exercise, ExerciseSelectOption, ExerciseSet } from '../types and interfaces/types'
import { onSnapshot, query, collection, where } from 'firebase/firestore'
import { FIRESTORE_DB } from '../../FirebaseConfig'




interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
};

type DateParams = {
    date: string; 
  };

const AddWorkout = ({ route, navigation }: RouterProps) => {
  const userID = useContext(UserContext);

  const { date } = route.params as DateParams;

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
  const [sets, setSets] = useState<ExerciseSet[]>([])
  const [isEnabled, setIsEnabled] =  useState(false)
  const [side, setSide] = useState("both")

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchExercises = async () => {
    try {
      const data = await getUsersExercises(userID);
      const exerciseData = [];
      data.forEach(exercise => {
        if (!exercise.hidden) {          
          exerciseData.push({
            label: exercise.name,
            value: exercise.name,
            unilateral: exercise.unilateral,
            isometric: exercise.isometric
          });
        }
      });
      setAllExercises(exerciseData);      
      setLoading(false);
    } 
    catch (error) {
      alert(`Couldn't retrieve exercises: ${error.message}`);
    }
  };

  const unsubscribe = onSnapshot(
    query(collection(FIRESTORE_DB, "Users"), where("userID", "==", userID)),
    () => {
      fetchExercises();
    }
  );

  return () => {
    unsubscribe();
  };

}, [userID]);
  


  useEffect(() => {
    if (currentExercise.unilateral)
      setSide("left");
    else if (!currentExercise.unilateral)
      setSide("both");
  }, [currentExercise])
  
  const changeNormal = {
    sides : side,
    weights : parseFloat(weight) ,
    reps :  parseFloat(reps),
    times :  parseFloat(time) ,
    restTimes : parseFloat(restTime)
  };
  const changeIsometric = {
    sides : side,
    weights : parseFloat(weight) ,
    times :  parseFloat(time) ,
    restTimes : parseFloat(restTime)
  };

  function toggleSwitch(): void {
    if (isEnabled)
        setSide('left');
    else
        setSide('right')
    setIsEnabled(previousState => !previousState);
  }

 /*  function addXP(): number {
    console.log(sets);
    let currentExperience = 0;
    for (let i = 0; i < selectedExercises.length; i++) {
      if (Number.isNaN(sets[i].weights)) {
        if (selectedExercises[i].isometric)
          currentExperience += sets[i].times;
        else
          currentExperience += sets[i].reps;
      } else {
          if (selectedExercises[i].isometric)
            currentExperience += sets[i].times * sets[i].weights;
          else
            currentExperience += sets[i].reps * sets[i].weights;      
      } 
    }

    return currentExperience
  } */
  

/*   function handleAddButton(): void {
    if (currentExercise.isometric) {
      if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) 
        alert("Time field cannot be empty");
      else{
        setSets((prev) => [...prev,changeIsometric])
        setSelectedExercises((prev) => [...prev,currentExercise])
        setTime("");
        setWeight("");
        setRestTime("");  
      }
    } else {
      if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps))
        alert("Reps field cannot be empty"); 
      else{
        setSets((prev) => [...prev,changeNormal]);
        setSelectedExercises((prev) => [...prev,currentExercise]);
        setTime("");
        setWeight("");
        setRestTime("");  
        setReps("");        
      }
    }
  }
 */
  function handleFinishButton(): void {
    if (sets.length === 0)
      alert("Not enough data");
    else{
     // addSet(userID,date, selectedExercises ,sets, addXP())
      setSets([]);
      setIsEnabled(false);
      setSide("both");
      navigation.navigate("Log")
    }
  }

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            style={styles.input}
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
                style={styles.input}
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
            style={styles.input}
            value={time}
            placeholder="Time (in seconds)"
            autoCapitalize='none'
            onChangeText={(text) => setTime(text)}
          />
          <Text style={styles.text}>Rest time (seconds)</Text>
          <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={restTime}
            placeholder="Rest time (in seconds)"
            autoCapitalize='none'
            onChangeText={(text) => setRestTime(text)}
          />
          <View style={styles.gridContainer}>
{/*             <Pressable style={styles.button} onPress={() => handleAddButton()}>
                <Text style={styles.text}>Add set</Text>
            </Pressable> */}
            <Pressable style={styles.button} onPress={() => handleFinishButton()}>
                <Text style={styles.text}>Finish</Text>
            </Pressable>
          </View>
          <Text style={styles.text}>Total sets: {selectedExercises.length}</Text>
        </View>
      }
    </ScrollView>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  input: {
    marginHorizontal: 10,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  },
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
  button:{
    width: 100,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#000",
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