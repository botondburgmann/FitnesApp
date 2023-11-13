import {ScrollView, StyleSheet, Text} from 'react-native'
import React from 'react'
import Routine from '../components/Routine';
import NavigationContext from '../contexts/NavigationContext';
import { RouterProps } from '../types and interfaces/interfaces';



const Routines = ({navigation}: RouterProps) => {
  

    const workoutTypes = ['Full body', 'Push', 'Pull', 'Leg', 'Back', 
                          'Chest', 'Bicep', 'Tricep', 'Shoulder', 'Ab', 
                          'Arm', 'Forearm','Upper body', 'Full body pull', 
                          'Full body push'];

    const routineComponents = [];
    for (let i = 0; i < workoutTypes.length; i++) {
      routineComponents.push(
        <Routine key={i} workoutType={workoutTypes[i]}/>
      );
    }
        
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavigationContext.Provider value={navigation}>
        <Text style={styles.label}>Choose workout type</Text>
        {routineComponents}
      </NavigationContext.Provider>
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
  label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: 30,
    textAlign: 'center',
  },
});