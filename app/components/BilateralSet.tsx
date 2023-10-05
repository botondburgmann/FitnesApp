import { View, TextInput } from 'react-native'
import React from 'react'

const BilateralSet = (props) => {
    const {weight, setWeight} = props.weight;    
    const {rep, setRep} = props.rep;    
    const {time, setTime} = props.time;    
    const {restTime, setRestTime} = props.restTime;    

  return (
    <View>
        <TextInput
            keyboardType='numeric'
            value={weight}
            onChangeText={(text) => setWeight(text)}
            placeholder='Weight (kg)'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            value={rep}
            onChangeText={(text) => setRep(text)}
            placeholder='Reps'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            value={time}
            onChangeText={(text) => setTime(text)}
            placeholder='Time (seconds)'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            value={restTime}
            onChangeText={(text) => setRestTime(text)}
            placeholder='Rest time (seconds)'
            autoCapitalize='none'
        />       
    </View>
  )
}

export default BilateralSet