import { StyleSheet, View,Text } from 'react-native'
import React, {useContext, useEffect, useState } from 'react'
import NormalExercise from './NormalExercise';
import IsometricExercise from './IsometricExercise';
import { getWorkout } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { Exercise } from '../types and interfaces/types';
import { globalStyles } from '../assets/styles';
import DateContext from '../contexts/DateContext';


const DisplaySets = (props: { date: string; }) => {
    const userID = useContext(UserContext);
    const date = props.date
    const [allExercises, setAllExercises] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
      const unsubscribeFromWorkouts = getWorkout(userID, date, (exercises: Exercise[]) => {
        const exerciseComponents: React.JSX.Element[] = [];
        
        exercises.forEach((exercise, index) => {
          if (exercise.reps[0] > 0) {
            exerciseComponents.push(<NormalExercise exercise={exercise} exerciseID={index} key={index} />);
          } else if (exercise.reps[0] === 0) {
            exerciseComponents.push(<IsometricExercise exercise={exercise} exerciseID={index} key={index} />);
          } else {
            alert("Error: Invalid rep number. Reps can't be negative");
          }          
        });
          setAllExercises(exerciseComponents);
      });
  
      return () => {       
        if (unsubscribeFromWorkouts !== undefined) {
          unsubscribeFromWorkouts();
        } 
        setAllExercises([]);
      };
    }, [userID, date]);

    return (
        <View style={styles.container}>
          <DateContext.Provider value={date}>{
            allExercises.length === 0 
              ? <Text style={[globalStyles.label, {marginHorizontal: 40}]}>You have no workout logged for this day yet</Text> 
              : allExercises}
            </DateContext.Provider>
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