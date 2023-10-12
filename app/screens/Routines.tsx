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
    
  const maleWorkoutImages = {
    'Full body': require('../assets/full-body-male.png'),
    'Push' : require('../assets/push-male.png'),
    'Pull' : require('../assets/pull-male.png'),
    'Leg' : require('../assets/leg-male.png'),
    'Back' : require('../assets/back-male.png'),
    'Chest' : require('../assets/chest-male.png'),
    'Bicep' : require('../assets/bicep-male.png'),
    'Tricep' : require('../assets/tricep-male.png'),
/*         'Shoulder' : require('../assets/shoulder-male.png'),
    'Ab' : require('../assets/ab-male.png'),
    'Arm' : require('../assets/arm-male.png'),
    'Forearm' : require('../assets/forearm-male.png'),
    'Upper body' : require('../assets/upper-body-male.png'),
    'Full body pull' : require('../assets/full-body-pull-male.png'),
    'Full body push' : require('../assets/full-body-push-male.png'), */
    };

  const femaleWorkoutImages = {
    'Full body': require('../assets/full-body-female.png'),
    'Push' : require('../assets/push-female.png'),
    'Pull' : require('../assets/pull-female.png'),
    'Leg' : require('../assets/leg-female.png'),
    'Back' : require('../assets/back-female.png'),
    'Chest' : require('../assets/chest-female.png'),
    'Bicep' : require('../assets/bicep-female.png'),
    'Tricep' : require('../assets/tricep-female.png'),
/*       'Shoulder' : require('../assets/shoulder-female.png'),
    'Ab' : require('../assets/ab-female.png'),
    'Arm' : require('../assets/arm-female.png'),
    'Forearm' : require('../assets/forearm-female.png'),
    'Upper body' : require('../assets/upper-body-female.png'),
    'Full body pull' : require('../assets/full-body-pull-female.png'),
    'Full body push' : require('../assets/full-body-push-female.png'), */
    };

    const workoutTypes = ['Full body', 'Push', 'Pull', 'Leg', 'Back', 
                          'Chest', 'Bicep', 'Tricep'];

    //, 'Shoulder', 'Ab', 'Arm', 'Forearm','Upper body', 'Full body pull', 'Full body push'
    const routineComponents = [];
    for (let i = 0; i < workoutTypes.length; i++) {
      const imageSource = gender === 'Male' ? maleWorkoutImages[workoutTypes[i]] : femaleWorkoutImages[workoutTypes[i]];
      routineComponents.push(
        <Routine key={i} imageSource={imageSource} workoutType={workoutTypes[i]} navigation={navigation}  />
      );
    }
        
  return (
    <ScrollView>
      {genderError && <Text style={styles.text}>{genderError}</Text>}
      {genderPending && <Text style={styles.text}>Loading your gender...</Text>}
      {gender && routineComponents}
     </ScrollView>
  )
}

export default Routines

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
    width: 250,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "#000",
  },
});