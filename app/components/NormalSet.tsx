import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const NormalSet = (props) => {
    const exercise = props.exercise;
    const handleDelete = props.handleDelete;
    const navigation = props.navigation;
    const exerciseID = props.exerciseID;
    const typeOfSet = props.typeOfSet;
    let isIsometric: boolean;

    const outputs = {
        reps : [],
        seconds: [],
        weights: [],
        names: [],
        sides: []
    }
 
    for (let i = 0; i < exercise.reps.length; i++) {
        typeOfSet === "straight" || typeOfSet === "drop"
            ? outputs.names.push("")
            : outputs.names.push(` of ${exercise.exerciseName[i]}`);
        exercise.sides[i] === "both" 
            ? outputs.sides.push(``) 
            : outputs.sides.push(`on the ${exercise.sides[i]} side`);    
        exercise.sides[i] === "both" 
            ? isIsometric = false
            : isIsometric = true;         
        exercise.reps[i] === 1 
            ? outputs.reps.push(`1 rep`) 
            : outputs.reps.push(`${exercise.reps[i]} reps`);    
        exercise.times[i] === 1 
            ? outputs.seconds.push('for 1 second') 
            :  exercise.times[i] > 1 
            ? outputs.seconds.push(`for ${ exercise.times[i]} seconds`)
            : outputs.seconds.push("");
        exercise.weights[i] == 0
            ? outputs.weights.push(`with no weight`)
            : exercise.weights[i] < 0
            ? outputs.weights.push(`with ${-exercise.weights[i]} kg assisted`)
            : outputs.weights.push(`with ${exercise.weights[i]} kg`);
    }
 
    
    return (
        <View>
            {outputs.reps.map((rep,index) => 
                <View key={index} style={styles.setContainer} >
                    
                    {typeOfSet !== "drop" 
                        ? <Text style={styles.text}>Set {index + 1}</Text>
                        : <></>
                    }
                    <Pressable
                        onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: isIsometric})} 
                        onLongPress={() => alert("delete")}                                
                    >
                        <Text style={styles.text}>{rep}{outputs.names[index]} {outputs.sides[index]} {outputs.weights[index]} {outputs.seconds[index]}</Text>                            
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

export default NormalSet

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 5
      },
      setContainer: {
        alignItems: 'center',
        marginVertical: 5
      },
      gridContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 10,
        marginVertical: 20

      },
      gridItem:{
        width: '50%',
        justifyContent: 'space-between',
        alignItems: 'center'
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
    }
})