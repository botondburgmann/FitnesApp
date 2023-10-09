import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Radiobutton from '../components/Radiobutton';



const Focus = () => {
const [focus, setFocus] = useState<string>();
const options = ["Strength", "Hypertrophy", "Cardio"];
  return (
    <View>
        <Radiobutton selectedValue={focus} setselectedValue={setFocus} options={options} />
        <Button onPress={() => alert("Start")} title="Next"/> 
    </View>
  )
}

export default Focus

const styles = StyleSheet.create({})