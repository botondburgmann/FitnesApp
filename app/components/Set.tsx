import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { ExerciseSet, Exercise } from '../types and interfaces/types';

const Set = (props) => {
    const exercise = props.exercise;
    const focus = props.focus;
    const setGoToNextPage = props.setGoToNextPage
    const setSets = props.setSets
    const [weight, setWeight] = useState("");
    const [time, setTime] = useState("");
    const [reps, setReps] = useState("");

    function handleCompleteSetButton(exercise:Exercise, weight: number, time: number, reps: number) {
         if (exercise.isometric && (time === 0 || Number.isNaN(time)))
          alert("Error: time field cannot be empty for isometric exercises");
        else if (!exercise.isometric && (reps === 0 || Number.isNaN(reps))) 
          alert("Error: reps field cannot be empty for non-isometric exercises");
        else {
            if (Number.isNaN(weight))
                weight = 0;
            if (Number.isNaN(time))
                time = 0;            
            if (Number.isNaN(reps))
                reps = 0;            
            const newSet = {
                exercise: exercise.unilateral ? [exercise.name, exercise.name] : [exercise.name],
                weights: exercise.unilateral ? [weight, weight] : [weight],
                reps: exercise.unilateral ? [reps, reps] : [reps],
                times: exercise.unilateral ? [time, time] : [time],
                restTimes: [],
                sides: exercise.unilateral ? ["left", "right"] : ["both"],
            }
            setSets(prevSets => ({
                ...prevSets,
                exercise: [...prevSets.exercise, ...newSet.exercise],
                weights: [...prevSets.weights, ...newSet.weights],
                reps: [...prevSets.reps, ...newSet.reps],
                times: [...prevSets.times, ...newSet.times],
                restTimes: [...prevSets.restTimes, ...newSet.restTimes],
                sides: [...prevSets.sides, ...newSet.sides],
              }));
              setGoToNextPage(true)
        }
      }
  return (
    <View>
        <Text style={styles.label}>{exercise.name}</Text>
        {exercise.musclesWorked.length === 1 && focus === "strength" 
        ? exercise.unilateral 
        ? <Text style={styles.text}>Do 2-3 repetitons each side</Text>
        :  <Text style={styles.text}>Do 2-3 repetitons</Text>
        : exercise.unilateral 
        ? <Text style={styles.text}>Do 6-8 repetitons each side</Text>
        :  <Text style={styles.text}>Do 6-8 repetitons</Text>
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
                value={time}
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
                value={reps}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setReps(text)}
            />
        </>
        }
        <Pressable style={styles.button} onPress={() => handleCompleteSetButton(exercise, parseFloat(weight), 
                                                                                parseFloat(time),
                                                                                parseFloat(reps))}>
            <Text style={styles.text}>Next</Text>                   
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