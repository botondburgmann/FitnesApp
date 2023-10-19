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
    for (let i = 1; i < sets.length; i++)
    if (sets[i-1].weight !== sets[i].weight) {
        sameWeight = false;
        break;
    }

    let sameRest = true;
    const restNumber = new Set(sets.restTime).size;
    if (restNumber > 1) 
      sameRest = false;

    return (
        <View style={styles.container}>
            <Text style={styles.exercise}>{sets.length} sets of {exercise}</Text>
            {noWeight ? 
                <View style={{ flexDirection: 'row' }}>
                    {sets.map((item, index) => (<Text style={styles.text} key={index}>{item.reps} </Text>))}
                    <Text style={styles.text}>repetitions with no weight </Text>
                </View>
            : sameWeight ? 
                <View style={{ flexDirection: 'row' }}>
                    {sets.map((item, index) => (<Text style={styles.text} key={index}>{item.reps} </Text>))}
                    <Text style={styles.text}>repetitions with {sets[0].weight} kg each </Text>
                </View> 
            :   
                <View style={{ flexDirection: 'row' }}>
                    {sets.map((item, index) => (<Text style={styles.text} key={index}>{item.reps} </Text>))}
                    <Text style={styles.text}>repetitions with </Text>
                    {sets.map((item, index) => (<Text style={styles.text}  key={index}>{item.weight} kg </Text>))}
                </View>}
      
            {sameRest ? 
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}>Rest: {sets[0].restTime/60} minutes between sets</Text>
                </View> 
            :   
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}>Rest: </Text>
                    {sets.map((item, index) => (<Text style={styles.text}  key={index}>{item.restTime/60} minutes</Text>))}
                </View>}
        </View>
    )
}

export default DisplayStraightBiSet

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