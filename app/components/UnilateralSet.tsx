import { View, TextInput } from 'react-native'
import React from 'react'

const UnilateralSet = ({set, setSet}) => {

    return (
        <View>
            <TextInput
                keyboardType='numeric'
                value={set.weightLeft}
                onChangeText={(text) => setSet({...set, weightLeft: text})}
                placeholder='Weight (kg) left'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={set.repsLeft}
                onChangeText={(text) => setSet({...set, repsLeft: text})}
                placeholder='Reps left'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={set.timeLeft}
                onChangeText={(text) => setSet({...set, timeLeft: text})}
                placeholder='Time (seconds) left'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={set.restTimeLeft}
                onChangeText={(text) => setSet({...set, restTimeLeft: text})}
                placeholder='Rest time (seconds) left'
                autoCapitalize='none'
            />       
            <TextInput
                keyboardType='numeric'
                value={set.weightRight}
                onChangeText={(text) => setSet({...set, weightRight: text})}
                placeholder='Weight (kg) right'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={set.repsRight}
                onChangeText={(text) => setSet({...set, repsRight: text})}
                placeholder='Reps right'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={set.timeRight}
                onChangeText={(text) => setSet({...set, timeRight: text})}
                placeholder='Time (seconds) right'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={set.restTimeRight}
                onChangeText={(text) => setSet({...set, restTimeRight: text})}
                placeholder='Rest time (seconds) right'
                autoCapitalize='none'
            />       
        </View>
  )
}

export default UnilateralSet