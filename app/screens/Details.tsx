import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import {BestExercise, ExerciseRecords, TableState } from '../types and interfaces/types';
import { getExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import {Table, Row, Rows} from 'react-native-table-component'


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Details = ({ route, navigation }: RouterProps) => {
  const userID = useContext(UserContext);

  const { exercise } = route?.params;

  const [records, setRecords] = useState<ExerciseRecords>({
    weights: [],
    reps: [],
    times: [],
    dates: [],
  })

  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<TableState>({
    tableHead: ["Date", "Weight (kg)", "Repetitons", "Time (seconds)"],
    tableData: []
  });

  let mostWeight ={
    name: exercise,
    weights: 0,
    reps: 0
  }
  let mostReps = {
    name: exercise,
    weights: 0,
    reps: 0
  }

  useEffect(() => {
    const unsubscribe = getExercise(userID, exercise, records => {      
      setRecords(records);
      setLoading(false);
  
    })

    
    return () => {
      unsubscribe()
    }
  }, [userID, exercise]);
  

  function sortRecords(records:ExerciseRecords): ExerciseRecords {
    for (let i = 1; i <= records.dates.length; i++) {
      let dateOne = new Date(records.dates[i-1]);
      let dateTwo = new Date(records.dates[i]);
      if (dateOne > dateTwo) {
        for (const key in records) {
          let temp = records[key][i];
          records[key][i] = records[key][i-1];
          records[key][i] = temp;
        }
      }      
    }
    return records;
  }

  function fillTable(records:ExerciseRecords, table: TableState): void{
    const sortedRecords = sortRecords(records);
    for (let i = 0; i < sortedRecords.dates.length; i++) {
      let row = [sortedRecords.dates[i], sortedRecords.weights[i], sortedRecords.reps[i], sortedRecords.times[i]];
      
      table.tableData.push(row);
    }
  }

  function findMaxWeight(records:ExerciseRecords, exercise: string): BestExercise {
    if (!loading) {
      let currentMax = {
        name: exercise,
        weights: 0,
        reps: 0
      }
  
      for (let i = 0; i < records.weights.length; i++) {
        if (records.weights[i]>currentMax.weights) {
          currentMax.weights = records.weights[i];
          currentMax.reps = records.reps[i];
        }
        else if (records.weights[i] === currentMax.weights){
          if (records.reps[i] > currentMax.reps) {
            currentMax.weights = records.weights[i];
            currentMax.reps = records.reps[i];
          }
        }
      }
      
      return currentMax;
    }
  }
  function findMaxReps(records:ExerciseRecords, exercise: string): BestExercise {
    let currentMax = {
      name: exercise,
      weights: 0,
      reps: 0
    }
    for (let i = 0; i < records.weights.length; i++) {
      if (records.reps[i]>currentMax.reps) {
        currentMax.weights = records.weights[i];
        currentMax.reps = records.reps[i];
      }
      else if (records.reps[i] === currentMax.reps){
        if (records.weights[i] > currentMax.weights) {
          currentMax.weights = records.weights[i];
          currentMax.reps = records.reps[i];
        }
      }
    }
    return currentMax;
  }

  if (!loading){
    mostWeight = findMaxWeight(records, exercise);
    mostReps = findMaxReps(records, exercise)

    fillTable(records, table);

  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{exercise}</Text>
      {loading 
      ? <ActivityIndicator/> 
      : <ScrollView>
        <Text style={styles.text}>Maximum weight: {mostWeight.weights} kg for {mostWeight.reps} repetitons</Text>
        <Text style={styles.text}>Most repetitions: {mostReps.reps} with {mostReps.weights} kg</Text>
        <Table>
          <Row data={table.tableHead} textStyle={styles.text}/>
          <Rows data={table.tableData} textStyle={styles.text}/>
        </Table>
      </ScrollView> 
      
      }
    </View>
  )
}

export default Details

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
    createExerciseButton:{
      marginVertical: 20,
      alignSelf: 'flex-end',
      marginRight: 20,
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: '#808080',
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