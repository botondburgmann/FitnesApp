import {  Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import useFetch from '../hooks/useFetch';
import UserContext from '../contexts/UserContext';
import { Table, Row, Rows} from 'react-native-table-component';
import { getExercises, toggleExerciseVisibilty } from '../functions/databaseQueries';


interface ExerciseSelectOption{
  label: string;
  value: string;
  unilateral: boolean
}
const Exercises = () => {
  const userID = useContext(UserContext);

  
  const [exerciseToggled, setExerciseToggled] = useState("")
  const {data:exercises, isPending:exercisesPending, error:exercisesError } = useFetch(getExercises, userID);




  function toggleVisibilty(exerciseName) {
    toggleExerciseVisibilty(userID, exerciseName)
    exerciseToggled === exerciseName ? setExerciseToggled("") : setExerciseToggled(exerciseName);
  }

  const exerciseComponentsList = [];
    if (exercises) {
      for (const exercise of exercises) { 
        exerciseComponentsList.push(
        <View key={exercise.name} style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, flexWrap: 'wrap',}}>
          <Pressable style={{   width: '50%' }}>
            <Text style={{
                      textAlign: 'left',
                      fontSize: 16,
                      color: "#fff",
                      opacity: (exercise.hidden || exerciseToggled === exercise.name) ? 0.5 : 1,
                      textTransform: 'uppercase',
                      fontWeight: "600",
                      paddingVertical: 10,
            }}>{exercise.name}</Text>
          </Pressable>
          <Pressable>
            {(exercise.hidden || exerciseToggled === exercise.name) ? <Text style={styles.text} onPress={() => toggleVisibilty(exercise.name)}>Unhide exercise</Text>
            : <Text style={styles.text} onPress={() => toggleVisibilty(exercise.name)}>Hide exercise</Text>}
          </Pressable>
        </View>)
      }      
    }
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>My exercises</Text>
    <ScrollView>
      {exercisesError && <Text style={styles.text}>{exercisesError}</Text> }
      {exercisesPending && <Text style={styles.text}>Loading...</Text> }
      
      {exerciseComponentsList}
    </ScrollView>
    <Pressable>
        <Text style={styles.text}>Add new Exercise</Text>
      </Pressable>
    </View>
  )
}

export default Exercises

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'flex-start',
  backgroundColor: '#ff0000'
},
tableContainer:{
  marginHorizontal:10
},
text:{
  textAlign: 'left',
  fontSize: 16,
  color: "#fff",
  textTransform: 'uppercase',
  fontWeight: "600",
  paddingVertical: 10,
},
selectedExercise:{    alignSelf: 'center',
fontSize: 20,
fontWeight: "800",
color: "#fff",
textTransform: 'uppercase',
marginVertical: 20,
},
label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: 50,
    marginBottom: 20
  },
});