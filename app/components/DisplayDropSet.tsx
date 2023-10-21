import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { deleteExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

const DisplayDropSet = (props) => {
    const userID = useContext(UserContext);
    const exercise = props.exercise;
    const sets = props.sets;
    const id = props.id;

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
            <Text style={styles.exercise}>1 dropset of {exercise}</Text>
            {sets.map((item, index) => 
                item.weight !== undefined && item.time > 0 ? 
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
                </Text>
                )}
                
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