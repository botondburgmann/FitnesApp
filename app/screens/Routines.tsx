import {ImageBackground, ScrollView, Text} from 'react-native'
import React from 'react'
import Routine from '../components/Routine';
import NavigationContext from '../contexts/NavigationContext';
import { RouterProps } from '../types and interfaces/types';
import { backgroundImage, globalStyles } from '../assets/styles';



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
          <Text style={[globalStyles.label, {marginBottom: -10}]}>Choose workout type</Text>
          {routineComponents}
        </NavigationContext.Provider>
       </ScrollView>
    </ImageBackground>
  )
}

export default Routines
