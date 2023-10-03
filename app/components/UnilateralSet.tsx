import { View, Text, TextInput } from 'react-native'
import React from 'react'

const UnilateralSet = (props) => {
    const {leftWeight, setLeftWeight} = props.leftWeight;    
    const {leftReps, setLeftReps} = props.leftReps;    
    const {leftTime, setLeftTime} = props.leftTime;    
    const {leftRestTime, setLeftRestTime} = props.leftRestTime;    
    const {rightWeight, setRightWeight} = props.rightWeight;    
    const {rightReps, setRightReps} = props.rightReps;    
    const {rightTime, setRightTime} = props.rightTime;    
    const {rightRestTime, setRightRestTime} = props.rightRestTime;    

    return (
        <View>
            <TextInput
                keyboardType='numeric'
                value={leftWeight}
                onChangeText={(text) => setLeftWeight(text)}
                placeholder='Weight (kg) left'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={leftReps}
                onChangeText={(text) => setLeftReps(text)}
                placeholder='Reps left'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={leftTime}
                onChangeText={(text) => setLeftTime(text)}
                placeholder='Time (seconds) left'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={leftRestTime}
                onChangeText={(text) => setLeftRestTime(text)}
                placeholder='Rest time (seconds) left'
                autoCapitalize='none'
            />       
            <TextInput
                keyboardType='numeric'
                value={rightWeight}
                onChangeText={(text) => setRightWeight(text)}
                placeholder='Weight (kg) right'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={rightReps}
                onChangeText={(text) => setRightReps(text)}
                placeholder='Reps right'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={rightTime}
                onChangeText={(text) => setRightTime(text)}
                placeholder='Time (seconds) right'
                autoCapitalize='none'
            />
            <TextInput
                keyboardType='numeric'
                value={rightRestTime}
                onChangeText={(text) => setRightRestTime(text)}
                placeholder='Rest time (seconds) right'
                autoCapitalize='none'
            />       
        </View>
  )
}

export default UnilateralSet