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

  
  const [toggled, setToggled] = useState(false)
  const {data:exercises, isPending:exercisesPending, error:exercisesError } = useFetch(getExercises, userID, "", "", [], toggled);




  function toggleVisibilty(exerciseName) {
    toggleExerciseVisibilty(userID, exerciseName)
    toggled ? setToggled(false) : setToggled(true);
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
                      opacity: exercise.hidden ? 0.5 : 1,
                      textTransform: 'uppercase',
                      fontWeight: "600",
                      paddingVertical: 10,
            }}>{exercise.name}</Text>
          </Pressable>
          <Pressable>
            {exercise.hidden ? <Text style={styles.text} onPress={() => toggleVisibilty(exercise.name)}>Unhide exercise</Text>
            : <Text style={styles.text} onPress={() => toggleVisibilty(exercise.name)}>Hide exercise</Text>}
          </Pressable>
        </View>)
      }      
    }
  
   

  
/* 
  const [currentExercise, setCurrentExercise] = useState<string>();
  const [tableData, setTableData] = useState([[],[],[],[]]);

  const {data:exercise, isPending:exercisePending, error:exerciseError } = useFetch(getExercise, userID, currentExercise);

  
  useEffect(() => {
    if (!exercisesPending && !exercisesError && exercises) {      
      const exerciseData = exercises.map((exercise) => ({
        label: exercise.name,
        value: exercise.name,
        unilateral: exercise.unilateral,
      }));
      setAllExercises(exerciseData);
    }
    if (!exercisePending && !exerciseError && exercise) { 
       const exerciseInOrder = sortArrays(exercise, exercise.dates.slice());
      
      setTableData([exerciseInOrder.weights, exerciseInOrder.reps, exerciseInOrder.times, exerciseInOrder.restTimes]);

    }
  }, [exercise, exercisePending, exerciseError]);

  function sortArrays(exercise, keyArray) {
    const indices = exercise.dates.map((_, index) => index);
    indices.sort((a, b) => {
      const dateA = new Date(exercise.dates[a]).getTime();
      const dateB = new Date(exercise.dates[b]).getTime();
      return dateA - dateB;
    });

// Create new objects with sorted data arrays
const sortedData = {
  "dates": indices.map(index => exercise.dates[index]),
  "reps": indices.map(index => exercise.reps[index]),
  "restTimes": indices.map(index => exercise.restTimes[index]),
  "times": indices.map(index => exercise.times[index]),
  "weights": indices.map(index => exercise.weights[index])
};
  
    return sortedData;
  }
  function transposeMatrix(matrix) {
    
    const rows = matrix.length;
    const columns = matrix[0].length;
  
    const transposedMatrix = new Array(columns);
    for (let i = 0; i < columns; i++) {
      transposedMatrix[i] = new Array(rows);
    }
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        transposedMatrix[j][i] = matrix[i][j];
      }
    }
  
    return transposedMatrix;
  }
   */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>My exercises</Text>
      {exercisesError && <Text style={styles.text}>{exercisesError}</Text> }
      {exercisesPending && <Text style={styles.text}>Loading...</Text> }
      
      {exerciseComponentsList}
    </ScrollView>
  )
}

export default Exercises

const styles = StyleSheet.create({
  container: {
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