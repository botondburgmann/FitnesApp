import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import { getExercises, getExercise } from '../functions/databaseQueries';
import useFetch from '../hooks/useFetch';
import UserContext from '../contexts/UserContext';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


interface ExerciseSelectOption{
  label: string;
  value: string;
  unilateral: boolean
}
const Exercises = () => {
  const userID = useContext(UserContext);

  const [allExercises, setAllExercises] = useState<ExerciseSelectOption[]>();
  const [currentExercise, setCurrentExercise] = useState<string>();
  const [tableData, setTableData] = useState([]);


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
      setTableData([exercise.weights, exercise.reps, exercise.times, exercise.restTimes]);
      console.log(tableData);
      

    }
  }, [exercises, exercisesPending, exercisesError, exercise, exercisePending, exerciseError]);

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

      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}} >
        <Row data={ ['Weight', 'Reps', 'Time', 'Rest Time']} textStyle={styles.text}/>
        <Rows data={transposeMatrix(tableData)} textStyle={styles.text} />
      </Table>
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