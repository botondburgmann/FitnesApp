import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DisplayStraightBiSet = (props) => {
    const exercise = props.exercise;
    const sets = props.sets;

    let noWeight = true;
    for (let i = 0; i < sets.length; i++)
        if (sets[i].weight > 0) {
            noWeight = false;
            break;
        }

    let sameWeight = true;
    const weightsNumber = new Set(sets.weights).size;
    if (weightsNumber > 1) 
      sameWeight = false;

    let sameRest = true;
    const restNumber = new Set(sets.restTime).size;
    if (restNumber > 1) 
      sameRest = false;

    return (
        <View>
            <Text>{sets.length} sets of {exercise}</Text>
            {noWeight ? 
                <View style={{ flexDirection: 'row' }}>
                    {sets.map((item, index) => (<Text  key={index}>{item.reps} </Text>))}
                    <Text>repetitions with no weight </Text>
                </View>
            : sameWeight ? 
                <View style={{ flexDirection: 'row' }}>
                    {sets.map((item, index) => (<Text  key={index}>{item.reps} </Text>))}
                    <Text>repetitions with {sets[0].weight} kg each </Text>
                </View> 
            :   
                <View style={{ flexDirection: 'row' }}>
                    {sets.map((item, index) => (<Text  key={index}>{item.reps} </Text>))}
                    <Text>repetitions with </Text>
                    {sets.map((item, index) => (<Text  key={index}>{item.weight} kg </Text>))}
                </View>}
      
            {sameRest ? 
                <View style={{ flexDirection: 'row' }}>
                    <Text>Rest: {sets[0].restTime/60} minutes between sets</Text>
                </View> 
            :   
                <View style={{ flexDirection: 'row' }}>
                    <Text>Rest: </Text>
                    {sets.map((item, index) => (<Text  key={index}>{item.restTime/60} minutes</Text>))}
                </View>}
        </View>
    )
}

export default DisplayStraightBiSet

const styles = StyleSheet.create({})