import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

const Focus = () => {
const [focus, setFocus] = useState<string>();

  return (
    <View>
        <RadioButtonGroup
            containerStyle={{ marginBottom: 10 }}
            selected={focus}
            onSelected={(value) => setFocus(value)}
            radioBackground="green">

            <RadioButtonItem value="strength" label="Strength" />
            <RadioButtonItem value="hypertrophy" label="Hypertrophy"/>
            <RadioButtonItem value="cardio" label="Cardio"/>
        </RadioButtonGroup>   
        <Button onPress={() => alert("Start")} title="Next"/> 
    </View>
  )
}

export default Focus

const styles = StyleSheet.create({})