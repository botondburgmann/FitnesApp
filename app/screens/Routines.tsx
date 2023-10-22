import {ScrollView, StyleSheet, Text, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import Routine from '../components/Routine';
import { getGender } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import useFetch from '../hooks/useFetch';


interface RouterProps {
  navigation: NavigationProp<any, any>;
}


const Routines = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext)
  const {data:gender, isPending:genderPending, error:genderError} = useFetch(getGender, userID);
    
  

    const workoutTypes = ['Full body', 'Push', 'Pull', 'Leg', 'Back', 
                          'Chest', 'Bicep', 'Tricep', 'Shoulder', 'Ab', 'Arm', 'Forearm','Upper body', 'Full body pull', 'Full body push'];

    const routineComponents = [];
    for (let i = 0; i < workoutTypes.length; i++) {
      routineComponents.push(
        <Routine key={i} workoutType={workoutTypes[i]} navigation={navigation}  />
      );
    }
        
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {genderError && <Text style={styles.text}>{genderError}</Text>}
      {genderPending && <Text style={styles.text}>Loading your gender...</Text>}
      {gender && routineComponents}
     </ScrollView>
  )
}

export default Routines

const styles = StyleSheet.create({
  container: {
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
    width: 250,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "#000",
  },
});