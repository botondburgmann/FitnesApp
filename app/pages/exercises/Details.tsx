import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { NavigationProp } from "@react-navigation/native";
import UserContext from "../../contexts/UserContext";
import {Table, Row, Rows} from "react-native-table-component"
import { backgroundImage, globalStyles } from "../../assets/styles";
import { Unsubscribe } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import {  ExerciseRecords, TableRow, TableState } from "./types";
import { BestExercise } from "../../types and interfaces/types";


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Details = ({ route }: RouterProps) => {
  const userID = useContext(UserContext);

  const { exercise } = route?.params;



  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<TableState>({
    tableHead: ["Date", "Weight (kg)", "Repetitons", "Time (seconds)"],
    tableData: []
  });
  const [mostWeight, setMostWeight] = useState<BestExercise>({
    name: exercise,
    weights: 0,
    reps: 0
  })
  const [mostReps, setMostReps] = useState<BestExercise>({
    name: exercise,
    weights: 0,
    reps: 0
  })
  const [records, setRecords] = useState<ExerciseRecords>({
    weights: [],
    reps: [],
    times: [],
    dates: [],
  })

  function getExercise (userID: string | null, exerciseName: string, callback: Function): Unsubscribe | undefined {
    try {
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    
        const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, workoutSnapshot => {
            const exerciseRecords: ExerciseRecords = {
                weights: [],
                reps: [],
                times: [],
                dates: [],
            }
            if (!workoutSnapshot.empty) {
                workoutSnapshot.docs.forEach(workoutDoc => {
                    for (let i = 0; i < workoutDoc.data().Workout.length; i++) {
                        let set = workoutDoc.data().Workout[i];                    
                        for (let j = set.exercise.length-1; j >= 0 ; j--)
                            if (set.exercise[j] === exerciseName) {                            
                                exerciseRecords.weights.push(set.weights[j])
                                exerciseRecords.reps.push(set.reps[j])
                                exerciseRecords.times.push(set.times[j])
                                exerciseRecords.dates.push(workoutDoc.data().date)
                            }
                    }
                })
                            
            }
            callback(exerciseRecords);    
        })
        return unsubscribeFromWorkouts;
    } catch (error: any) {
        alert(`Error: Couldn't fetch data for ${exerciseName}: ${error} `)
    }
};

  useEffect(() => {
    const unsubscribeFromExercise = getExercise(userID, exercise, (response: React.SetStateAction<ExerciseRecords>) => {
      setRecords(response)      
      setLoading(false);
    });

    return () => {        
    if (unsubscribeFromExercise !== undefined) {
      unsubscribeFromExercise()
      setRecords({
        weights: [],
        reps: [],
        times: [],
        dates: [],
      });
    }
    };
  }, [userID, exercise]);
  

  useEffect(() => {
    fillTable(records, setTable);
    if (!loading) {
          setMostWeight(findMaxWeight(records, exercise));
          setMostReps(findMaxReps(records, exercise));
          
    }

    return () => {
      setTable({
        tableHead: ["Date", "Weight (kg)", "Repetitons", "Time (seconds)"],
        tableData: []
      });
    };
  }, [records, loading])
  
  
  function sortRecords(records: ExerciseRecords): ExerciseRecords {
    const datesWithIndexes = records.dates.map((date, index) => ({
      date,
      index,
    }));
  
    datesWithIndexes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
    const sortedRecords: ExerciseRecords = {
      dates: [],
      weights: [],
      reps: [],
      times: [],
    };
  
    for (const { date, index } of datesWithIndexes) {
      sortedRecords.dates.push(date);
      sortedRecords.weights.push(records.weights[index]);
      sortedRecords.reps.push(records.reps[index]);
      sortedRecords.times.push(records.times[index]);
    }
  
    return sortedRecords;
  }
  
  
  

  function fillTable(records: ExerciseRecords, setTable: (table: TableState) => void) {
    const sortedRecords = sortRecords(records);
  
    const newTableData: TableRow[] = sortedRecords.dates.map((date, i) => [
      date,
      sortedRecords.weights[i],
      sortedRecords.reps[i],
      sortedRecords.times[i],
    ]);
  
    const newTableState: TableState = {
      tableHead: ["Date", "Weight (kg)", "Repetitions", "Time (seconds)"],
      tableData: newTableData,
    };
  
    setTable(newTableState);
  }
  
  
  

  function findMaxWeight(records:ExerciseRecords, exercise: string): BestExercise {
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



  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        <Text style={[globalStyles.label, {marginTop: 50, marginBottom: 20}]}>{exercise}</Text>
        {loading
        ? <ActivityIndicator/>
        : table.tableData.length === 0 ?
        <Text style={[globalStyles.label, {marginTop: 50, marginBottom: 20}]}>No data</Text>

        : <ScrollView>
          <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10, paddingLeft: 10, fontSize: 14, alignSelf: "flex-start"}]}>Maximum weight: {mostWeight.weights} kg for {mostWeight.reps} repetitons</Text>
          <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10, paddingLeft: 10, fontSize: 14, alignSelf: "flex-start"}]}>Most repetitions: {mostReps.reps} with {mostReps.weights} kg</Text>
          <View style={{ backgroundColor: "rgba(255,0,0,0.7)" }}>
            <Table borderStyle={{borderWidth: 1, borderColor: "#fff"}}>
              <Row data={table.tableHead} style={styles.head} textStyle={styles.headText}/>
              <Rows data={table.tableData} textStyle={styles.cellText}/>
            </Table>
          </View>
        </ScrollView>
      
        }
      </View>
    </ImageBackground>
  )
}

export default Details

const styles = StyleSheet.create({

  tableContainer:{
    marginHorizontal:10
  },
  text:{
    textAlign: "left",
    fontSize: 12,
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "600",
    paddingVertical: 10,
    opacity: 1
  },
  head:{
    height: 50,
  },
  headText:{
    color: "#fff",
    fontSize: 12  ,
    fontWeight: "800",
    textTransform: "uppercase",
    textAlign: "center"
  },  
  cellText:{
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 5,
    textAlign: "center"
  },
  selectedExercise:{    alignSelf: "center",
  fontSize: 20,
  fontWeight: "800",
  color: "#fff",
  textTransform: "uppercase",
  marginVertical: 20,
  },
  label: {
      alignSelf: "center",
      fontSize: 20,
      fontWeight: "800",
      color: "#fff",
      textTransform: "uppercase",
      marginTop: 50,
      marginBottom: 20
    },
    createExerciseButton:{
      marginVertical: 20,
      alignSelf: "flex-end",
      marginRight: 20,
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: "#808080",
      justifyContent: "center",
      alignItems: "center",
    },
    createExerciseButtonText:{
      fontSize: 25,
      color: "#fff",
      fontWeight: "600",
      alignSelf: "center"
    }
  });