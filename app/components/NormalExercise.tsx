import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ExerciseSet } from '../types and interfaces/types';
import { calculateNumberOfSets, isDropsSet, isSuperSet, removeXP, showDeleteConfirmation } from '../functions/otherFunctions';
import UserContext from '../contexts/UserContext';
import NavigationContext from '../contexts/NavigationContext';


const NormalExercise = (props) => {    
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
        if (!(isSuperSet(exercise.restTimes,uniqueValues.exercise.length) || isDropsSet(exercise.restTimes, exercise.reps, exercise.weights, uniqueValues.exercise.length)) || isDropsSet(exercise.restTimes, exercise.reps, exercise.weights, uniqueValues.exercise.length)) 
            outputs.names.push("");
        else 
            outputs.names.push(` of ${exercise.exercise[i]}`);
        if (exercise.sides[i] === "both")
            outputs.sides.push("");
        else
            outputs.sides.push(`on the ${exercise.sides[i]} side`); 
        if (exercise.reps[i] === 1) 
            outputs.reps.push(`1 rep`) 
        else    
            outputs.reps.push(`${exercise.reps[i]} reps`);    
        if (exercise.times[i] === 1) 
            outputs.seconds.push('for 1 second') 
        else if (exercise.times[i] > 1) 
            outputs.seconds.push(`for ${ exercise.times[i]} seconds`)
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

    outputs.reps.map((rep,index) => 
        sets.push(
        <View key={index} style={styles.container} >
            {
                outputs.setNumbers[index] !== ""
                    ? <Text style={styles.text}>{outputs.setNumbers[index]}</Text>
                    : <></>
            }
            <Pressable
                onPress={() => navigation.navigate("Edit set",{set: {exercise : exercise.exercise[index],
                    reps: exercise.reps[index],
                    restTime: exercise.restTimes[index],
                    side: exercise.sides[index],
                    time: exercise.times[index],
                    weight: exercise.weights[index],
                    }, exerciseID: exerciseID, setID: index, isIsometric: false})} 
                onLongPress={() => showDeleteConfirmation(userID, exercise.exercise[index], exerciseID, index, removeXP(exercise.reps[index],exercise.weights[index]))}                                
            >
                <Text style={styles.text}>{rep}{outputs.names[index]} {outputs.sides[index]} {outputs.weights[index]} {outputs.seconds[index]}</Text>                            
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
                <View>
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

export default NormalExercise

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
        textAlign: 'center',
        flexWrap: 'wrap'
    },

})