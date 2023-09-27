import { View, Text, TextInput } from 'react-native'
import React from 'react'

const BilateralSet = () => {
  return (
    <View>
        <TextInput
            keyboardType='numeric'
            placeholder='Weight (kg)'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Reps'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Time (seconds)'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            placeholder='Rest time (seconds)'
            autoCapitalize='none'
        />       
    </View>
  )
}

export default BilateralSet