import { Pressable, ScrollView, StyleSheet, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import Routine from '../components/Routine';
import { getGender } from '../functions/databaseQueries';

interface RouteParams {
    userID: string;
  }

const Routines = () => {
    const route = useRoute();
    const {userID} = route.params as RouteParams;

    const [gender, setGender] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getGender(userID);  
            data && setGender(data);
            
          } catch (error) {
            console.error("Error fetching exercises:", error);
          }
        };
    
        fetchData();    
      }, [])
    

    const maleWorkoutImages = {
        'Full body': require('../assets/full-body-male.png'),
        'Push' : require('../assets/push-male.png'),
        'Pull' : require('../assets/pull-male.png'),
        'Legs' : require('../assets/legs-male.png'),
        'Back' : require('../assets/back-male.png'),
        'Chest' : require('../assets/chest-male.png'),
        'Bicep' : require('../assets/bicep-male.png'),
        'Tricep' : require('../assets/tricep-male.png'),
        // Add more workout types and their corresponding image paths here
      };

    const femaleWorkoutImages = {
        'Full body': require('../assets/full-body-female.png'),
        'Push' : require('../assets/push-female.png'),
        'Pull' : require('../assets/pull-female.png'),
        'Legs' : require('../assets/legs-female.png'),
        'Back' : require('../assets/back-female.png'),
        'Chest' : require('../assets/chest-female.png'),
        'Bicep' : require('../assets/bicep-female.png'),
        'Tricep' : require('../assets/tricep-female.png'),
        // Add more workout types and their corresponding image paths here
      };
    const workoutTypes = ['Full body', 'Push', 'Pull', 'Legs', 'Back', 'Chest', 'Bicep', 'Tricep'];

    const routineComponents = [];
    for (let i = 0; i < workoutTypes.length; i++) {
        const imageSource = gender === 'male' ? maleWorkoutImages[workoutTypes[i]] : femaleWorkoutImages[workoutTypes[i]];
        routineComponents.push(
          <Routine key={i} imageSource={imageSource} workoutType={workoutTypes[i]} />
        );
      }
        
  return (
    <ScrollView>
        {routineComponents}
     </ScrollView>
  )
}

export default Routines
