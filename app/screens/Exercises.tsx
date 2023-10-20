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
      console.log(`sorted: ${exerciseInOrder}`); 
      
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
      />
      <Text style={styles.label}>{currentExercise}</Text>
      {exercise && <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
        <Row data={ ['Weight (kg)', 'Reps', 'Time (seconds)', 'Rest Time (minutes)']} textStyle={styles.text} />
        <Rows data={transposeMatrix(tableData)} textStyle={styles.text}   />
      </Table>}
    </View>
  )
}

export default Exercises

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
   flex: 0.5, //
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