import { StyleSheet, View,Text } from 'react-native'
import React, {useContext, useEffect, useState } from 'react'
import NormalExercise from './NormalExercise';
import IsometricExercise from './IsometricExercise';
import { getWorkout } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';


const DisplaySets = (props) => {
    const userID = useContext(UserContext);
    const date = props.date
    const [allExercises, setAllExercises] = useState([]); // Use state to store the components

    useEffect(() => {
      const unsubscribeFromWorkouts = getWorkout(userID, date, (exercises) => {
        const exerciseComponents = [];
        
        exercises.forEach((exercise, index) => {
          if (exercise.reps[0] > 0) {
            exerciseComponents.push(<NormalExercise exercise={exercise} exerciseID={index} key={index} />);
          } else if (exercise.reps[0] === 0) {
            exerciseComponents.push(<IsometricExercise exercise={exercise} exerciseID={index} key={index} />);
          } else {
            console.error("Error: Invalid rep number. Reps can't be negative");
          }          
        });
  
        setAllExercises(exerciseComponents); // Update the state with the components
      });
  
      return () => {        
        unsubscribeFromWorkouts();
        setAllExercises([]);
      };
    }, [userID, date]);

    return (
        <View style={styles.container}>
            {allExercises}
        </View>    
    )

}

export default DisplaySets

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 5
    }
})