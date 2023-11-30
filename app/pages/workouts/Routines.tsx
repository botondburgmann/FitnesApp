import {ImageBackground, ScrollView, Text, StyleSheet} from 'react-native'
import React from 'react'
import NavigationContext from '../../contexts/NavigationContext';
import { RouterProps } from '../../types and interfaces/types';
import { backgroundImage, globalStyles } from '../../assets/styles';
import Routine from './components/Routine';



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
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <ScrollView contentContainerStyle={globalStyles.container}>
        <NavigationContext.Provider value={navigation}>
          <Text style={styles.label}>Choose workout type</Text>
          {routineComponents}
        </NavigationContext.Provider>
       </ScrollView>
    </ImageBackground>
  )
}

export default Routines
const styles = StyleSheet.create({
  label: {   
    alignSelf: 'center',
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 40,
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: "#000",
    textShadowOffset:{
        height: 2,
        width: 2
    },
    textShadowRadius: 10,
    textTransform: 'uppercase',
},
})