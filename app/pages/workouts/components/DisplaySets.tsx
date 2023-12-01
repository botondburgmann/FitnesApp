import { StyleSheet, View,Text } from 'react-native'
import React, {useContext, useEffect, useState } from 'react'
import ExerciseLog from './ExerciseLog';
import UserContext from '../../../contexts/UserContext';
import { Exercise } from '../../../types and interfaces/types';
import DateContext from '../../../contexts/DateContext';
import { workoutsStyles } from '../styles';
import { getWorkout } from '../workoutsFunction';
import { ExerciseLogType } from '../types';


const DisplaySets = (props: { date: Date; }) => {
    const userID = useContext(UserContext);
    const date = props.date
    const [allExercises, setAllExercises] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
      const unsubscribeFromWorkouts = getWorkout(userID, date, (exercises: ExerciseLogType[]) => {
        const exerciseComponents: React.JSX.Element[] = [];
        
        exercises.forEach((exercise, index) => {
          if (exercise.reps[0] < 0)
            alert("Error: Invalid rep number. Reps can't be negative");
          else
            exerciseComponents.push(<ExerciseLog exercise={exercise} exerciseID={index} key={index} />);          
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
              ? <Text style={workoutsStyles.label}>You have no workout logged for this day yet</Text> 
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