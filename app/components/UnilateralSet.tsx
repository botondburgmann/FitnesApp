import { View, Text, TextInput } from 'react-native'
import React from 'react'

const UnilateralSet = () => {
  return (
    <View>
        <TextInput
            keyboardType='numeric'
            placeholder='Weight (kg) left'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Reps left'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Time (seconds) left'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Rest time (seconds) left'
            autoCapitalize='none'
        />       
        <TextInput
            keyboardType='numeric'
            placeholder='Weight (kg) right'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Reps right'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Time (seconds) right'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Rest time (seconds) right'
            autoCapitalize='none'
        />       
    </View>
  )
}

export default UnilateralSet