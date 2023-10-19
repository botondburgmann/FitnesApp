import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DisplayDropBiSet = (props) => {
    const exercise = props.exercise;
    const sets = props.sets;

    

    
    return (
        <View>
            <Text>1 dropset of {exercise}</Text>
            <View style={{ flexDirection: 'row' }}>
                {sets.map((item, index) => (<Text  key={index}>{item.reps} </Text>))}
                <Text> repetitions with </Text>
                {sets.map((item, index) => (<Text  key={index}>{item.weight} kg </Text>))}
            </View>
            {sets[sets.length-1].restTime > 0 && <Text>Rest: {sets[sets.length-1].restTime/60} minutes</Text>}
        </View>
    )
}

export default DisplayDropBiSet

const styles = StyleSheet.create({})