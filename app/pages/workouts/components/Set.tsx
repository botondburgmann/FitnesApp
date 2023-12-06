import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Exercise, Sets, SingleSet } from '../../../types and interfaces/types';
import { globalStyles } from '../../../assets/styles';
import { addXP, validateData } from '../workoutsFunction';

const Set = (props: { exercise: Exercise; focus: string; setCompletedSet: Function; sets: Sets;  }) => {
    const exercise = props.exercise;
    const focus = props.focus;
    const setCompletedSet = props.setCompletedSet
    const sets = props.sets;
    const [weight, setWeight] = useState("");
    const [time, setTime] = useState("");
    const [reps, setReps] = useState("");

    function completeSet (exercise: Exercise, weight: string, time: string, reps: string): void {
        try {
            
            const numericData = {
                exercise: exercise.label, 
                reps: parseFloat(reps) | 0, 
                restTime: 1, 
                side: "both" as "both" | "left" | "right", 
                time: parseFloat(time) | 0, 
                weight: parseFloat(weight) | 0
            };

            validateData(exercise.isometric, numericData.reps, numericData.time, numericData.restTime);
  
            if (exercise.unilateral) {
                sets.exercise.push(...[exercise.label, exercise.label])
                sets.reps.push(...[numericData.reps, numericData.reps])
                sets.sides.push(...["left", "right"] as ("left" | "right")[]);
                sets.times.push(...[numericData.time, numericData.time]);
                sets.weights.push(...[numericData.weight, numericData.weight]);
                
            }
            else {
                sets.exercise.push(exercise.label)
                sets.reps.push(numericData.reps)
                sets.sides.push("both");
                sets.times.push(numericData.time);
                sets.weights.push(numericData.weight);

             
            }
            setCompletedSet(true)
        
        } 
        catch (error: any) {
            alert(`Error: Couldn't complete set: ${error}`)
        }
    }
  return (
    <View>
        <Text style={[globalStyles.label, {marginVertical: 50}]}>{exercise.label}</Text>
        {exercise.isometric
            ? exercise.musclesWorked.length === 1 && focus === "strength"
                ? exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 20-30 seconds each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 20-30 seconds</Text>
                : exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 30-60 seconds each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 30-60 seconds</Text>
            :
            exercise.musclesWorked.length === 1 && focus === "strength" 
                ? exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 2-3 repetitons each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 2-3 repetitons</Text>
                : exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 6-8 repetitons each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 6-8 repetitons</Text>

        }
        
        <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>weight (kg)</Text>
        <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={weight}
            placeholder="optional"
            autoCapitalize='none'
            onChangeText={(text) => setWeight(text)}
        />
        {
        exercise.isometric
        ? <>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>time (seconds)</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.input}
                value={time}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setTime(text)}
            />
        </>
        : <>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>repetitons</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.input}
                value={reps}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setReps(text)}
            />
        </>
        }
        <Text style={[globalStyles.text, { fontWeight: "600", marginHorizontal: 10}]}>For maximum efficency choose a weight that makes you fail in these repetiton ranges</Text>
        <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => completeSet(exercise, weight, time, reps)}>
            <Text style={globalStyles.buttonText}>Next</Text>                   
        </Pressable>
  </View>
  )
}

export default Set

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ff0000'
    },
    input: {
        marginHorizontal: 10,
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'center'
    }
  });