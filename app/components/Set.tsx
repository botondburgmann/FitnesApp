import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { ExerciseSet, Exercise } from '../types and interfaces/types';

const Set = (props) => {
    const exercise = props.exercise;
    const focus = props.focus;
    const [weight, setWeight] = useState("");
    const [time, setTime] = useState("");
    const [reps, setReps] = useState("");
    const [restTime, setRestTime] = useState("");
    const [sets, setSets] = useState<ExerciseSet>({
        exercise : [],
        weights: [],
        reps: [],
        times: [],
        restTimes: [],
        sides: []
      });
    function handleCompleteSetButton(exercise:Exercise, weight: number, time: number, reps: number, sets: ExerciseSet) {
        if (exercise.isometric && (time === 0 || Number.isNaN(time)))
          throw new Error("time field cannot be empty for isometric exercises");
        else if (!exercise.isometric && (reps === 0 || Number.isNaN(reps))) 
          throw new Error("reps field cannot be empty for non-isometric exercises");
        else {
          exercise.unilateral ? sets.exercise = [...sets.exercise, ...[exercise.name, exercise.name]] : sets.sides.push(exercise.name)
          exercise.unilateral ? sets.reps = [...sets.reps, ...[reps, reps]] : sets.reps.push(reps);
          exercise.unilateral ? sets.sides = [...sets.sides, ...["left", "right"]] : sets.sides.push("both");
          exercise.unilateral ? sets.times = [...sets.times, ...[time, time]] : sets.times.push(time);
          exercise.unilateral ? sets.weights = [...sets.weights, ...[weight, weight]] : sets.weights.push(weight);
        }
      }
  return (
    <View>
        <Text style={styles.label}>{exercise.name}</Text>
        {exercise.musclesWorked.length === 1 && focus === "strength" 
        ? exercise.unilateral 
        ? <Text>Do 2-3 repetitons each side</Text>
        :  <Text>Do 2-3 repetitons</Text>
        : exercise.unilateral 
        ? <Text>Do 6-8 repetitons each side</Text>
        :  <Text>Do 6-8 repetitons</Text>
        }
        
        <Text style={styles.text}>weight (kg)</Text>
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
            <Text style={styles.text}>time (seconds)</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.input}
                value={weight}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setTime(text)}
            />
        </>
        : <>
            <Text style={styles.text}>repetitons</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.input}
                value={weight}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setReps(text)}
            />
        </>
        }
        <Pressable style={styles.button} onPress={() => handleCompleteSetButton(exercise.name, parseFloat(weight), 
                                                                                parseFloat(time),
                                                                                parseFloat(reps), sets )}>
            <Text style={styles.text}>Modify</Text>                   
        </Pressable>
  </View>
  )
}

export default Set

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    text:{
        alignSelf: 'center',
        fontSize: 18,
        color: "#fff",
        textTransform: 'uppercase',
        fontWeight: "600",
        paddingVertical: 10,
    },
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'center'
    },
    button:{
        width: 100,
        paddingHorizontal: 5,
        marginHorizontal: 20,
        alignSelf: "center",
        backgroundColor: "#000",
    },
    label: {
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        textTransform: 'uppercase',
        textAlign: 'center',
        marginVertical: 50
    },
  });