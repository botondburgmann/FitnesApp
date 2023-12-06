import { StyleSheet, View,Text } from 'react-native'
import React, {useContext, useEffect, useState } from 'react'
import ExerciseLog from './ExerciseLog';
import UserContext from '../../../contexts/UserContext';
import { workoutsStyles } from '../styles';
import { getWorkout } from '../workoutsFunction';
import DateContext from '../../../contexts/DateContext';
import { Sets } from '../../../types and interfaces/types';


const DisplaySets = () => {
    const userID = useContext(UserContext);
    const date = useContext(DateContext)
    const [allExercises, setAllExercises] = useState<React.JSX.Element[]>([]);
    
    useEffect(() => {
      if (!userID || !date) return;
      const unsubscribeFromWorkouts = getWorkout(userID, date, (exercises: Sets[]) => {
        const exerciseComponents: React.JSX.Element[] = [];
        
        exercises.forEach((exercise, index) => {
          exerciseComponents.push(<ExerciseLog exercise={exercise} exerciseID={index}  key={index} />);          
        });        
        
        setAllExercises(exerciseComponents);
      });
  
      return () => {       
        if (unsubscribeFromWorkouts !== undefined) unsubscribeFromWorkouts();          
        
        setAllExercises([]);
      };
    }, [userID, date]);

    return (
        <View style={styles.container}>{
            allExercises.length === 0 
              ? <Text style={workoutsStyles.label}>You have no workout logged for this day yet</Text> 
              : allExercises}
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