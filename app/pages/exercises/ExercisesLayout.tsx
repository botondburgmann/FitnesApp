import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateExercise from './CreateExercise';
import Details from './Details';
import Exercises from './Exercises';

const ExercisesLayout = () => {
    const Stack = createNativeStackNavigator();

    return( 
        <Stack.Navigator>
          <Stack.Screen name="Exercise List" component={Exercises} options={{ headerShown: false }}/>
          <Stack.Screen name="Create Exercise" component={CreateExercise}  />
          <Stack.Screen name="Details" component={Details}  />
        </Stack.Navigator>
      )
}

export default ExercisesLayout