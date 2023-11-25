import {  ActivityIndicator, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import { getAllExercises, toggleExerciseVisibilty } from '../functions/databaseQueries';
import { Exercise } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import { backgroundImage, globalStyles } from '../assets/styles';

const Exercises = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribeFunctions = getAllExercises(userID, (receivedExercises: React.SetStateAction<Exercise[]>) => {                    
        setExercises(receivedExercises);
        setLoading(false);
    });

    return () => {
      if (unsubscribeFunctions !== undefined) {
        unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
      }
        
        setExercises([]);
    };
}, [userID]);




  const exerciseComponentsList: React.JSX.Element[] = [];
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
            ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]} onPress={() => toggleExerciseVisibilty(userID, exercise.name)
            }>Unhide exercise</Text>
            : <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]} onPress={() => toggleExerciseVisibilty(userID, exercise.name)
            }>Hide exercise</Text>}
        </Pressable>
      </View>)
  })

    
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        <Text style={[globalStyles.label, {marginTop: 50, marginBottom: 20}]}>My exercises</Text>
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
    </ImageBackground>
  )
}

export default Exercises

const styles = StyleSheet.create({
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