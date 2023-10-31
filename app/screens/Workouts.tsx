import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import { NavigationProp } from '@react-navigation/native';
import UserContext from '../contexts/UserContext';
import {  deleteSet } from '../functions/databaseQueries';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import DisplaySet from '../components/DisplaySet';

interface RouterProps {
  navigation: NavigationProp<any, any>;
};


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
          const exercise = {
            exerciseName: doc.data().Workout[i].exercise,
            reps: doc.data().Workout[i].reps,
            weights: doc.data().Workout[i].weights,
            times: doc.data().Workout[i].times,
            sides: doc.data().Workout[i].sides,
            restTimes: doc.data().Workout[i].restTimes,
          };
          setWorkout((prev) => [...prev, exercise]);            
        }        
      })
    })
  }, [userID, date]);
  

  function showDeleteConfirmation (exerciseName,exerciseID, setID, xpDelete): void {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => { deleteSet(userID, exerciseName, exerciseID,  setID, xpDelete)},
      }],
      { cancelable: false }
    );
  };
    


  return (
    <View style={styles.container}>
      <Datepicker date={date} setDate={setDate} />
      <Text style={[styles.text, {marginTop: 20}]}>{date.toDateString()}</Text>
      
      <ScrollView contentContainerStyle={styles.log}>
        {workout && workout.map((exercise, index) => 
          <DisplaySet key={index} exerciseID={index}  exercise={exercise} handleDelete={showDeleteConfirmation} navigation={navigation}/>
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

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    marginVertical: 20
  },
  log:{
    justifyContent:'flex-end',
  },
});