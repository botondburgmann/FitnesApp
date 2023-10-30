import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import { NavigationProp } from '@react-navigation/native';
import UserContext from '../contexts/UserContext';
import {  deleteSet, getWorkout } from '../functions/databaseQueries';
import { collection, query, where, getDocs, onSnapshot, snapshotEqual } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import DisplayDropSet from '../components/DisplayDropSet';
import DisplayStraightSet from '../components/DisplayStraightSet';
import DisplaySuperSet from '../components/DisplaySuperSet';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}


const Workouts = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [date, setDate] = useState(new Date());

  const [workout, setWorkout] = useState([]);


  useEffect(() => {
    setWorkout([]);
    const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');
    const q = query(workoutsCollectionRef, where("userID", "==", userID), where("date", "==", date.toDateString()));
    
    onSnapshot(q, (snapshot) => {
      setWorkout([]);

      snapshot.docs.forEach((doc) => {        
        for (let i = 0; i < doc.data().Workout.length; i++) {
          if(doc.data().Workout[i].reps !== undefined){
            const exercise = {
              exerciseName: doc.data().Workout[i].exercise,
              reps: doc.data().Workout[i].reps,
              weights: doc.data().Workout[i].weights,
              times: doc.data().Workout[i].times,
              restTimes: doc.data().Workout[i].restTimes,
              typeOfSet: doc.data().Workout[i].typeOfSet
            }
            
            setWorkout((prev) => [...prev, exercise])
          }
          else{
            const exercise = {
              exerciseName: doc.data().Workout[i].exercise,
              repsLeft: doc.data().Workout[i].repsLeft,
              weightsLeft: doc.data().Workout[i].weightsLeft,
              timesLeft: doc.data().Workout[i].timesLeft,
              restTimesLeft: doc.data().Workout[i].restTimesLeft,
              repsRight: doc.data().Workout[i].repsRight,
              weightsRight: doc.data().Workout[i].weightsRight,
              timesRight: doc.data().Workout[i].timesRight,
              restTimesRight: doc.data().Workout[i].restTimesRight,
              typeOfSet: doc.data().Workout[i].typeOfSet
            }
            
            setWorkout((prev) => [...prev, exercise])            
          }        
        }
        
        
        
      })
    })
    
  }, [userID, date]);
  
  function calculateXP(sets) {
    let experiencePoints = 0;
    if (sets.reps !== undefined) {
      for (let i = 0; i < sets.reps.length; i++) {
        if (sets.weights[i] === 0) {
          experiencePoints -= sets.reps[i];
        }
        else {
          experiencePoints -= sets.reps[i] * sets.weights[i];
        }
      }
    }
    else {
      for (let i = 0; i < sets.repsLeft.length; i++) {
        if (sets.weightsLeft[i] === 0) {
          experiencePoints -= sets.repsleft[i];
        }
        else {
          experiencePoints -= sets.repsLeft[i] * sets.weightsLeft[i];
        }
      }
      for (let i = 0; i < sets.repsRight.length; i++) {
        if (sets.weightsRight[i] === 0) {
          experiencePoints -= sets.repsRight[i];
        }
        else {
          experiencePoints -= sets.repsRight[i] * sets.weightsRight[i];
        }
      }
    }    
  return experiencePoints;  
  }
  const showDeleteConfirmation = (exerciseName, setID, xpDelete) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteSet(userID, exerciseName, setID, -xpDelete)
          },
        },
      ],
      { cancelable: false }
    );
  };
    


  return (
    <View style={styles.container}>
    <Datepicker date={date} setDate={setDate} />
    <Text style={[styles.text, {marginTop: 20}]}>{date.toDateString()}</Text>
    <ScrollView contentContainerStyle={styles.log}>
    {workout && workout.map((exercise, index) => 
       exercise.typeOfSet === "straight" ? (<DisplayStraightSet key={index}  exercise={exercise} handleDelete={showDeleteConfirmation}/>)
       :  exercise.typeOfSet === "drop" ? (<DisplayDropSet key={index}  exercise={exercise} handleDelete={showDeleteConfirmation}/>)
       : exercise.typeOfSet === "super" ?(<DisplaySuperSet key={index}  exercise={exercise} handleDelete={showDeleteConfirmation}/>)
       : <></>

    )}
    </ScrollView>
    
    <View style={styles.buttonGroup}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Add',{ date: date.toDateString()})}>
        <Text style={styles.text}>Add new Exercise</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Routine')}>
        <Text style={styles.text}>Ask for routine</Text>
      </Pressable>
    </View>     
  </View>
  )
}

export default Workouts

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