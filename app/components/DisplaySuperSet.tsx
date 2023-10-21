import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { deleteExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

const DisplaySuperSet = (props) => {
    const userID = useContext(UserContext);

    const exercises = props.exercises;
    const sets = props.sets;
    const id = props.id;

    const exerciseNumber = new Set(exercises).size;
    function calculateXP() {
        let experiencePoints = 0;
    for (const set of sets) {
      if (set.weightLeft !== undefined || set.weightRight !== undefined) {
        if (set.weightLeft === 0)
          experiencePoints -= set.repsLeft;
        else
          experiencePoints -= set.repsLeft * set.weightLeft;
        if (set.weightRight === 0)
          experiencePoints -= set.repsRight;
        else
          experiencePoints -= set.repsRight * set.weightRight;
      }
      else{
        if (set.weight === 0)
          experiencePoints -= set.reps;
        else
          experiencePoints -= set.reps * set.weight;
      }
    }

    return experiencePoints;
        
    }

    function deleteSets() {
        alert("Deleted successfully")
        deleteExercise(userID, id, calculateXP())
    }
    return (
        <Pressable style={styles.container} onPress={() => deleteSets()}>
            {sets.length > 1 
            ?
            <>
                <Text style={[styles.exercise, {marginTop:20}]}>{exercises.length/exerciseNumber} supersets of</Text>
                <Text style={[styles.exercise, {marginBottom:20}]}>{exercises[0]}s and {exercises[1]}s</Text>
            </> 
            :             <>
            <Text style={[styles.exercise, {marginTop:20}]}>{exercises.length/exerciseNumber} supersets of</Text>
            <Text style={[styles.exercise, {marginBottom:20}]}>{exercises[0]} and {exercises[1]}</Text>
        </> } 
            
            
            <View style={styles.gridContainer}>
            {sets.map((item, index) => (
                <View key={index} style={styles.gridItem}>
                    {item.weight !== undefined && item.time > 0 ? 
                <Text 
                    style={styles.text} 
                    key={index}
                >
                    {item.weight} kg 
                    for {item.reps} reps
                    for {item.time} seconds
                </Text>
                : item.weight !== undefined && item.time === 0 ?
                <Text 
                    style={styles.text} 
                    key={index}
                >
                    {item.weight} kg 
                    for {item.reps} reps
                </Text>
                : item.weight === undefined && item.time > 0 ?
                <Text 
                    style={styles.text} 
                    key={index}
                >
                    {item.weightLeft}/{item.weightRight} kg 
                    for {item.repsLeft}/{item.repsRight} reps
                    for  {item.timeLeft}/{item.timeRight} seconds
                </Text>
                :
                <Text 
                    style={styles.text} 
                    key={index}
                >
                    {item.weightLeft}/{item.weightRight} kg 
                    for {item.repsLeft}/{item.repsRight} reps
                </Text>}
                </View>))}
            </View>
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