import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const IsometricSet = (props) => {
    const exercise = props.exercise;
    const handleDelete = props.handleDelete;
    const navigation = props.navigation;
    const exerciseID = props.exerciseID;
    const typeOfSet = props.typeOfSet;

    const outputs = {
        setNumbers: [],
        seconds: [],
        weights: [],
        names: [],
        sides: []
    };
 
    for (let i = 0; i < exercise.times.length; i++) {
        typeOfSet === "straight" || typeOfSet === "drop"
            ? outputs.names.push("")
            : outputs.names.push(` of ${exercise.exerciseName[i]}`);
        exercise.sides[i] === "both" 
            ? outputs.sides.push(``) 
            : outputs.sides.push(`on the ${exercise.sides[i]} side`);          
        exercise.times[i] === 1 
            ? outputs.seconds.push('1 second hold') 
            :  exercise.times[i] > 1 
            ? outputs.seconds.push(`${ exercise.times[i]} seconds hold`)
            : outputs.seconds.push("");
        exercise.weights[i] == 0
            ? outputs.weights.push(`with no weight`)
            : exercise.weights[i] < 0
            ? outputs.weights.push(`with ${-exercise.weights[i]} kg assisted`)
            : outputs.weights.push(`with ${exercise.weights[i]} kg`);
    }

    for (let i = 0; i < exercise.sides.length; i++) {
        if (typeOfSet === "drop" || (typeOfSet === "super" && exercise.exerciseName[i] !== exercise.exerciseName[0]) && exercise.sides[i] !== "both")
            outputs.setNumbers.push("");
        else if (exercise.sides[i] === "both")
            outputs.setNumbers.push(`Set ${i+1}`);
        else if(exercise.sides[i] !== "both" && i % 2 === 0)
            i === 0 ? outputs.setNumbers.push(`Set ${i+1}`) : outputs.setNumbers.push(`Set ${i}`);
        else
            outputs.setNumbers.push("");
    }
 
    function removeXP(setID): number {
        let currentExperience = 0;
        if (exercise.weights[setID] === 0)
            currentExperience -= exercise.times[setID];
        else 
            currentExperience -= exercise.times[setID] * exercise.weights[setID];
        return currentExperience;
    }
    return (
        <View>
            {outputs.seconds.map((second,index) => 
                <View key={index} style={styles.container} >
                    {
                        outputs.setNumbers[index] !== ""
                            ? <Text style={styles.text}>{outputs.setNumbers[index]}</Text>
                            : <></>
                    }
                    <Pressable
                        onPress={() => navigation.navigate("Edit set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: true})} 
                        onLongPress={() => handleDelete(exercise.exerciseName[index], exerciseID, index, removeXP(index))}                                
                    >
                        <Text style={styles.text}>{second}{outputs.names[index]} {outputs.sides[index]} {outputs.weights[index]}</Text>
                        { exercise.restTimes[index] > 0
                            ? <Text style={styles.text}>{exercise.restTimes[index]/60} minute rest</Text>
                            : <></>
                        }                            
                    </Pressable>
                </View>
            )}
        </View>
    )
}

export default IsometricSet

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
})