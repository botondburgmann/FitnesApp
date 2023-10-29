import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { deleteExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

const DisplaySuperSet = (props) => {
    const userID = useContext(UserContext);

    const exercise = props.exercise;

    const exerciseNumber = new Set(exercise).size;



    return (
        <Pressable style={styles.container}>
        {exercise.reps.length > 1 
                ? <Text style={styles.exercise}>{exercise.reps.length} sets of {exercise.exerciseName[0]}s</Text>
                : <Text style={styles.exercise}>{exercise.reps.length} setssdfds of {exercise.exerciseName[0]}</Text>}         
        </Pressable>    
    )
}

export default DisplaySuperSet

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 70,
      },
    gridItem: {
        width: '50%', // Make each item take up 50% of the container's width for a 2x2 grid
        marginVertical: 10
    },
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
        fontWeight: 'bold',
        letterSpacing: 0.25,

        color: 'white',
    }
})