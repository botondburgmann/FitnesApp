import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { deleteExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

const DisplayDropSet = (props) => {
    const userID = useContext(UserContext);
    const exercise = props.exercise;
    

    
    return (
        <Pressable style={styles.container}>
            <Text style={styles.exercise}>1 dropset of {exercise.exerciseName[0]}</Text>
                
        </Pressable>
    )
}

export default DisplayDropSet

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