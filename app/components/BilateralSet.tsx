import { View, TextInput } from 'react-native'
import React from 'react'

const BilateralSet = ({set, setSet}) => {
   

  return (
    <View>
        <TextInput
            keyboardType='numeric'
            value={set.weight  }
            onChangeText={(text) => setSet({...set, weight: text})}
            placeholder='Weight (kg)'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            value={set.reps}
            onChangeText={(text) => setSet({...set, reps: text})}
            placeholder='Reps'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            value={set.time}
            onChangeText={(text) => setSet({...set, time: text})}
            placeholder='Time (seconds)'
            autoCapitalize='none'
        />
        <TextInput
            keyboardType='numeric'
            value={set.restTime}
            onChangeText={(text) => setSet({...set, restTime: text})}
            placeholder='Rest time (seconds)'
            autoCapitalize='none'
        />       
    </View>
  )
}

export default BilateralSet