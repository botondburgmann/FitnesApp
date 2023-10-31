import { KeyboardAvoidingView, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import { addSet, getExercises } from '../functions/databaseQueries'
import UnilateralSet from '../components/UnilateralSet'
import BilateralSet from '../components/BilateralSet'
import UserContext from '../contexts/UserContext'
import useFetch from '../hooks/useFetch'
import { NavigationProp, useRoute } from '@react-navigation/native'


interface Isometric {
  sides: string;
  weights : number;
  times :  number;
  restTimes : number;
}

interface Normal {
  sides: string;
  weights : number;
  reps: number;
  times :  number;
  restTimes : number;
}

interface ExerciseSelectOption{
  label: string;
  value: string;
  unilateral: boolean
  isometric: boolean
}


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

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
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [restTime, setRestTime] = useState("");
  const [sets, setSets] = useState<(Isometric | Normal)[]>([])
  const {data:exercises, error:exercisesError } = useFetch(getExercises, userID);
  const [isEnabled, setIsEnabled] =  useState(false)
  const [side, setSide] = useState<string>("both")
  
  useEffect(() => {
    if ( !exercisesError && exercises) {
      const exerciseData = [];
      exercises.forEach(exercise => {
        if (!exercise.hidden) {          
          exerciseData.push({
            label: exercise.name,
            value: exercise.name,
            unilateral: exercise.unilateral,
            isometric: exercise.isometric
          })
        }
      });
      setAllExercises(exerciseData);
    }
  }, [exercises, exercisesError]);

  useEffect(() => {
    if (currentExercise.unilateral) {
      setSide("left");
    }
  
  }, [currentExercise])
  
  const changeNormal = {
    sides : side,
    weights : parseFloat(weight) ,
    reps :  parseFloat(reps),
    times :  parseFloat(time) ,
    restTimes : parseFloat(restTime)
  }
const changeIsometric = {
    sides: side,
    weights : parseFloat(weight) ,
    times :  parseFloat(time) ,
    restTimes : parseFloat(restTime)
}



  function toggleSwitch() {
      if (isEnabled) {
          setSide('left');
      }
      else {
          setSide('right')
      }
      setIsEnabled(previousState => !previousState);
  }

  function addXP() {
      let currentExperience = 0;
      if (!isEnabled) {
          if (changeNormal.weights === 0 && Number.isNaN(changeNormal.weights)) {
              currentExperience += changeNormal.reps
          }
          else {
              currentExperience += changeNormal.reps * changeNormal.weights
          }
      }
      else {
          if (changeNormal.weights === 0 && Number.isNaN(changeNormal.weights)) {
              currentExperience += changeNormal.times
          }
          else {
              currentExperience += changeNormal.times * changeNormal.weights
          }
      }
      console.log(currentExperience);
      
      return currentExperience
  }
  

  function handleAddButton() {
      if (currentExercise.isometric) {
          if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) {
              alert("Time field cannot be empty");
          }
          else{
              setSets((prev) => [...prev,changeIsometric])
              setSelectedExercises((prev) => [...prev,currentExercise.label])
          }
      } else {
          if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps)) {
              alert("Reps field cannot be empty"); 
          }
          else{
            setSets((prev) => [...prev,changeNormal])
            setSelectedExercises((prev) => [...prev,currentExercise.label])
          }
      }

  
  }
  function handleFinishButton() {
      if (isEnabled) {
          if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) {
              alert("Time field cannot be empty");
          }
          else{
              addSet(userID,date, selectedExercises ,sets, addXP())
              navigation.navigate("Log")
          }
      } else {
          if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps)) {
              alert("Reps field cannot be empty"); 
          }
          else{
              addSet(userID,date,selectedExercises, sets, addXP())
              navigation.navigate("Log")

          }
      }

  
  }

  
  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>

      <View style={styles.selectMenuContainer}
>
        <SelectMenu
          data={allExercises || []}
          setSelectedValue={ setCurrentExercise }
        />
      </View>
      {allExercises && 
              <View style={styles.container}>
              <Text style={styles.label}>Add new execise</Text>
              { currentExercise.unilateral
                  ?<View style={styles.gridContainer}>
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
            </>:
            <></>
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
              <Pressable style={styles.button} onPress={() => handleAddButton()}>
                  <Text style={styles.text}>Add set</Text>                   
              </Pressable>
              <Pressable style={styles.button} onPress={() => handleFinishButton()}>
                  <Text style={styles.text}>Finish</Text>                   
              </Pressable>
              <Text style={styles.text}>Total sets: {selectedExercises.length}</Text>
          </View>}
    </KeyboardAvoidingView>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
  container: {
  flex: 1,
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
  marginVertical: 20

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
    marginTop: -80,
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 40
  },
  buttonGroup: {
   flexDirection: 'row',
   justifyContent: 'space-evenly', 
   marginVertical: 20
  },
  inputGroup:{
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
  },
  selectMenuContainer: {
   backgroundColor: "#fff",
   padding: 5
  },
  icon: {
   alignSelf: 'center',
   fontSize: 18,
   color: "#fff",
   marginBottom: 50,
  },
  log:{
    justifyContent:'flex-end',
  },
});