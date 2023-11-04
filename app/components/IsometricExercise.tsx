import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { removeXP, isDropsSet, isSuperSet, calculateNumberOfSets, showDeleteConfirmation } from '../functions/otherFunctions';
import { NavigationContext } from '@react-navigation/native';
import UserContext from '../contexts/UserContext';
import { ExerciseSet } from '../types and interfaces/types';

const IsometricExercise = (props) => {

    const userID = useContext(UserContext);
    const navigation = useContext(NavigationContext);

    const exercise: ExerciseSet = props.exercise;
    const exerciseID = props.exerciseID;

    const uniqueValues = {
        sides: Array.from(new Set<string>(exercise.sides)),
        exercise: Array.from(new Set<string>(exercise.exercise))
        
    };
    const numberOfSets = calculateNumberOfSets(exercise.sides, uniqueValues.exercise.length, exercise.restTimes);
    const unilateral : string = uniqueValues.sides.length === 2 ? "(per side)" : "";

    const outputs = {
        setNumbers: [],
        reps : [],
        seconds: [],
        weights: [],
        names: [],
        sides: []
    };
 

    for (let i = 0; i < exercise.sides.length; i++) {
        if (isDropsSet(exercise.restTimes, exercise.reps, exercise.weights, uniqueValues.exercise.length) || (isSuperSet(exercise.restTimes,uniqueValues.exercise.length) && exercise.exercise[i] !== exercise.exercise[0]) && exercise.sides[i] !== "both")
            outputs.setNumbers.push("");
        else if (exercise.sides[i] === "both")
            outputs.setNumbers.push(`Set ${i+1}`);
        else if(exercise.sides[i] !== "both" && i % 2 === 0)
            i === 0 ? outputs.setNumbers.push(`Set ${i+1}`) : outputs.setNumbers.push(`Set ${i}`);
        else
            outputs.setNumbers.push("");
        if (!(isDropsSet(exercise.restTimes, exercise.reps, exercise.weights, uniqueValues.exercise.length) ||isSuperSet(exercise.restTimes,uniqueValues.exercise.length) ) || isDropsSet(exercise.restTimes, exercise.reps, exercise.weights, uniqueValues.exercise.length))
            outputs.names.push("")
        else
            outputs.names.push(` of ${exercise.exercise[i]}`);
        if (exercise.sides[i] === "both") 
            outputs.sides.push(``) 
        else
            outputs.sides.push(`on the ${exercise.sides[i]} side`);          
        if (exercise.times[i] === 1) 
            outputs.seconds.push('1 second hold') 
        else if (exercise.times[i] > 1) 
            outputs.seconds.push(`${ exercise.times[i]} seconds hold`)
        else
            outputs.seconds.push("");
        if (exercise.weights[i] == 0)
            outputs.weights.push(`with no weight`)
        else if (exercise.weights[i] < 0)
            outputs.weights.push(`with ${-exercise.weights[i]} kg assisted`)
        else
            outputs.weights.push(`with ${exercise.weights[i]} kg`);
    }
 
    const sets = [];
    outputs.seconds.map((second,index) => 
        sets.push(
        <View key={index} style={styles.container} >
            {
                outputs.setNumbers[index] !== ""
                    ? <Text style={styles.text}>{outputs.setNumbers[index]}</Text>
                    : <></>
            }
            <Pressable
                onPress={() => navigation.navigate("Edit set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: true})} 
                onLongPress={() => showDeleteConfirmation(userID, exercise.exercise[index], exerciseID, index, removeXP(index,exercise.times,exercise.weights))}                                
            >
                <Text style={styles.text}>{second}{outputs.names[index]} {outputs.sides[index]} {outputs.weights[index]}</Text>
                { exercise.restTimes[index] > 0
                    ? <Text style={styles.text}>{exercise.restTimes[index]/60} minute rest</Text>
                    : <></>
                }                            
            </Pressable>
        </View>)
    )
    return (
        <View>
           { isSuperSet(exercise.restTimes,uniqueValues.exercise.length) 
           ? <View>
                { numberOfSets === 1
                    ? <Text style={styles.exercise}>1 superset of</Text>
                    : <Text style={styles.exercise}>{numberOfSets} supersets</Text>
                }     
                <View style={styles.gridContainer}>
                    {uniqueValues.exercise.map((exercise,index) =>  
                    index !== uniqueValues.exercise.length-1
                        ? <Text style={styles.exercise} key={index}>{exercise} and </Text>
                        : <Text style={styles.exercise} key={index}>{exercise}</Text>
                    )}
                </View>
                {sets}
           </View>
            : isDropsSet(exercise.restTimes, exercise.reps, exercise.weights, uniqueValues.exercise.length) 
            ?
                <View>
                    <Text style={styles.exercise}>1 dropset of {uniqueValues.exercise} {unilateral}</Text>
                    {sets}       
                </View>
            :
            <View>
                { numberOfSets === 1
                    ? <Text style={styles.exercise}>1 set of {uniqueValues.exercise[0]}</Text>
                    : uniqueValues.exercise[0][uniqueValues.exercise[0].length-1] === "s" 
                    ? <Text style={styles.exercise}>{numberOfSets} sets of {uniqueValues.exercise[0]}es {unilateral}</Text>
                    : <Text style={styles.exercise}>{numberOfSets} sets of {uniqueValues.exercise[0]}s {unilateral}</Text>
                }
                {sets}                
            </View>}


        </View>
    )
}

export default IsometricExercise


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 5
      },
      
    text: {
        fontSize: 16,
        lineHeight: 25,
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center'
    },
    exercise: {
        fontSize: 20,
        lineHeight: 50,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center'
    },
    gridContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 10,
    }
})