import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DisplayDropBiSet = (props) => {
    const exercise = props.exercise;
    const sets = props.sets;

    

    
    return (
        <View style={styles.container}>
            <Text style={styles.exercise}>1 dropset of {exercise}</Text>
            <View style={{ flexDirection: 'row' }}>
                {sets.map((item, index) => (<Text style={styles.text} key={index}>{item.reps} </Text>))}
                <Text style={styles.text}> repetitions with </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>

                {sets.map((item, index) => (<Text style={styles.text}  key={index}>{item.weight} kg </Text>))}
            </View>
            {sets[sets.length-1].restTime > 0 && <Text style={styles.text}>Rest: {sets[sets.length-1].restTime/60} minutes</Text>}
        </View>
    )
}

export default DisplayDropBiSet

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