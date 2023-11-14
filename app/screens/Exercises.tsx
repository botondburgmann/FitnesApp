import {  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import { getAllExercises, toggleExerciseVisibilty } from '../functions/databaseQueries';
import { Exercise } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';

const Exercises = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = getAllExercises(userID, (exercises) => {
      setExercises(exercises);
      setLoading(false);
    });

  
  
    return () => {
      unsubscribe();
      setExercises([])
    }
  }, [userID]);



  const exerciseComponentsList = [];
  exercises.forEach((exercise, index) => {
    exerciseComponentsList.push(
      <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, flexWrap: 'wrap',}}>
        <Pressable style={{   width: '50%' }} onPress={()=>navigation.navigate('Details', {exercise: exercise.name})}>
          <Text style={{
                    textAlign: 'left',
                    fontSize: 16,
                    color: "#fff",
                    opacity: exercise.hidden ? 0.5 : 1,
                    textTransform: 'uppercase',
                    fontWeight: "600",
                    paddingVertical: 10,
          }}>{exercise.name}</Text>
        </Pressable>
        <Pressable>
          {exercise.hidden 
            ? <Text style={styles.text} onPress={() => toggleExerciseVisibilty(userID, exercise.name)
            }>Unhide exercise</Text>
            : <Text style={styles.text} onPress={() => toggleExerciseVisibilty(userID, exercise.name)
            }>Hide exercise</Text>}
        </Pressable>
      </View>)
  })

    
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>My exercises</Text>
      {loading 
      ? <ActivityIndicator/> 
      :  <ScrollView>
          { exerciseComponentsList}
        </ScrollView>
      }
    <Pressable style={styles.createExerciseButton} onPress={() => navigation.navigate("Create Exercise")}>
        <Text style={styles.createExerciseButtonText}>+</Text>
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
  createExerciseButton:{
    marginVertical: 20,
    alignSelf: 'flex-end',
    marginRight: 20,
    width: 50, // Set the desired width
    height: 50, // Set the desired height
    borderRadius: 50, // Make the borderRadius half of the width and height for a perfect circle
    backgroundColor: '#808080', // Set your desired background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  createExerciseButtonText:{
    fontSize: 25,
    color: "#fff",
    fontWeight: "600",
    alignSelf: 'center'
  }
});