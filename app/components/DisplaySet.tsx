import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import UserContext from '../contexts/UserContext';
import { getWorkout } from '../functions/databaseQueries';

interface UnilateralSet {
    name: string;
    weightLeft: number;
    weightRight: number;
    repsLeft: number;
    repsRight: number;
    timeLeft: number;
    timeRight: number;
    restTimeLeft: number;
    restTimeRight: number;
}
interface BilateralSet {
    name: string;
    weight: number;
    reps: number;
    time: number;
    restTime: number;
}

const DisplaySet = (props) => {
    const userID = useContext(UserContext);
    const date = props.date

    const {data: workout, isPending: workoutPending, error: workoutError} = useFetch(getWorkout, userID, date)
    

   
        
    if (workout) {
        const workoutInOrder = sortArrays(workout, workout.timeStamps.slice());
        console.log(workoutInOrder);
        const exerciseComponents = [];
        for (let i = 0; i < workoutInOrder.exercises.length; i++) {
            if (workoutInOrder.typeOfSets[i] === "straight") {
                exerciseComponents.push(<Text key={workoutInOrder.exercises[i][0]}>{workoutInOrder.exercises[i].length} sets of {workoutInOrder.exercises[i][0]} </Text>)

            }
        }
    }

            
        
     

          
          function sortArrays(workout, keyArray) {
            const indices = keyArray.map((_, index) => index);
          
            indices.sort((a, b) => (workout.timeStamps[a].nanoseconds + workout.timeStamps[a].seconds * 1e9) -(workout.timeStamps[b].nanoseconds + workout.timeStamps[b].seconds * 1e9));
          
            for (const prop in workout) {
              if (prop !== 'timeStamps') {
                workout[prop] = indices.map((index) => workout[prop][index]);
              }
            }
          
            workout.timeStamps = keyArray.sort((a, b) => a - b);
          
            return workout;
          }
          
          


    

 

    return (
        <View>
            {workoutError && <Text>{workoutError}</Text>}
            {workoutPending && <Text>Loading...</Text>}
            {workout && <Text>Coming soon...</Text>}
        </View>
  )
}

export default DisplaySet

const styles = StyleSheet.create({})