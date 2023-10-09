import { Pressable, ScrollView, StyleSheet, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import Routine from '../components/Routine';
import { getGender } from '../functions/databaseQueries';


interface RouterProps {
  navigation: NavigationProp<any, any>;
}
interface RouteParams {
    userID: string;
  }

const Routines = ({navigation}: RouterProps) => {
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
        {routineComponents}
     </ScrollView>
  )
}

export default Routines
