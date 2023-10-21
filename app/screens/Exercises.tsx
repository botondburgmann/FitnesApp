import {  StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import { getExercises, getExercise } from '../functions/databaseQueries';
import useFetch from '../hooks/useFetch';
import UserContext from '../contexts/UserContext';
import { Table, Row, Rows} from 'react-native-table-component';


interface ExerciseSelectOption{
  label: string;
  value: string;
  unilateral: boolean
}
const Exercises = () => {
  const userID = useContext(UserContext);

  const [allExercises, setAllExercises] = useState<ExerciseSelectOption[]>();
  const [currentExercise, setCurrentExercise] = useState<string>();
  const [tableData, setTableData] = useState([[],[],[],[]]);

  const {data:exercises, isPending:exercisesPending, error:exercisesError } = useFetch(getExercises, userID);
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
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>My progress</Text>
      <SelectMenu
        data={allExercises || []} 
        setSelectedValue={ setCurrentExercise }
        title={'Select exercise'}
      />
      <Text style={styles.selectedExercise}>{currentExercise}</Text>
      {exercise && <View style={styles.tableContainer}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={ ['Weight (kg)', 'Reps', 'Time (seconds)', 'Rest Time (minutes)']} textStyle={styles.text} />
          <Rows data={transposeMatrix(tableData)} textStyle={styles.text}   />
        </Table>
      </View>}
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
  textAlign: 'center',
  fontSize: 12,
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