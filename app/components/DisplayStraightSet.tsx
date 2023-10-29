import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { deleteExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

const DisplayStraightSet = (props) => {
    const userID = useContext(UserContext);

    const exercise = props.exercise;

    const properties = {
        isUnilateral: false,
        isIsometric: false,
        isWeighted: false
    }

 

    return (
   

    <Pressable style={styles.container}>
    {exercise.exerciseName.length > 1
            ? <Text style={styles.exercise}>{exercise.exerciseName.length} sets of {exercise.exerciseName[0]}s</Text>
            : <Text style={styles.exercise}>{exercise.exerciseName.length} set of {exercise.exerciseName[0]}</Text>}     
    {exercise.reps !== undefined 
    ?   exercise.reps.map((rep, index) => 
            exercise.weights[index] === undefined && exercise.times[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight {exercise.times[index]} + {exercise.restTimes[index]/60} minutes rest</Text>
            :  exercise.weights[index] === undefined 
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.times[index]} seconds + {exercise.restTimes[index]/60} minutes rest </Text>
            : exercise.times[index] === undefined 
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weights[index]} kg for {rep} reps + {exercise.restTimes[index]/60} min rest </Text>
            : <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weights[index]} kg for {rep} reps for {exercise.times[index]} seconds  + {exercise.restTimes[index]/60} min rest </Text>
        )
    : <>
         <Text style={styles.text}>Left side: </Text>
{         exercise.repsLeft.map((rep, index) => 
            exercise.weightsLeft[index] === undefined && exercise.timesLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight {exercise.timesLeft[index]}</Text>
            :  exercise.weightsLeft[index] === undefined && exercise.timesLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight + {exercise.restTimesLeft[index]/60} minutes rest </Text>
            : exercise.weightsLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesLeft[index]} seconds </Text>
            : exercise.weightsLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesLeft[index]} seconds + {exercise.restTimesLeft[index]/60} minutes rest </Text>
            : exercise.timesLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsLeft[index]} kg for {rep} reps</Text>
            : exercise.timesLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsLeft[index]} kg for {rep} reps + {exercise.restTimesLeft[index]/60} min rest </Text>
            : exercise.restTimesLeft[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsLeft[index]} kg for {rep} reps for {exercise.timesLeft[index]} seconds </Text>
            : <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsLeft[index]} kg for {rep} reps for {exercise.timesLeft[index]} seconds + {exercise.restTimesLeft[index]/60} min rest </Text>
        )}
         <Text style={styles.text}>Right side: </Text>
        {
            exercise.repsRight.map((rep, index) => 
            exercise.weightsRight[index] === undefined && exercise.timesRight[index] === undefined && exercise.restTimesRight[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight {exercise.timesRight[index]}</Text>
            :  exercise.weightsRight[index] === undefined && exercise.timesRight[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight + {exercise.restTimesRight[index]/60} minutes rest </Text>
            : exercise.weightsRight[index] === undefined && exercise.restTimesRight[index] === undefined    
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesRight[index]} seconds </Text>
            : exercise.weightsRight[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesRight[index]} seconds + {exercise.restTimesRight[index]/60} minutes rest </Text>
            : exercise.timesRight[index] === undefined && exercise.restTimesRight[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsRight[index]} kg for {rep} reps</Text>
            : exercise.timesRight[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsRight[index]} kg for {rep} reps + {exercise.restTimesRight[index]/60} min rest </Text>
            : exercise.restTimesRight[index] === undefined
            ? <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsRight[index]} kg for {rep} reps for {exercise.timesRight[index]} seconds </Text>
            : <Text style={styles.text} key={index}> Set {index + 1}: {exercise.weightsRight[index]} kg for {rep} reps for {exercise.timesRight[index]} seconds + {exercise.restTimesRight[index]/60} min rest </Text>
       )    
        }
    </>
    }    
    </Pressable>    
    )

}

export default DisplayStraightSet

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 0
      },
    text: {
        fontSize: 16,
        lineHeight: 25,
        letterSpacing: 0.25,
        color: 'white',
    },
    exercise: {
        fontSize: 20,
        lineHeight: 50,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    }
})