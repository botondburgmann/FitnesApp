import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

const BilateralSet = (props) => {
    const {weight, setWeight} = props.weight;    
    const {reps, setReps} = props.reps;    
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
            value={reps}
            onChangeText={(text) => setReps(text)}
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