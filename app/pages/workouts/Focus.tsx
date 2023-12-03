import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Radiobutton from '../../components/Radiobutton';
import { NavigationProp } from '@react-navigation/native';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { RouterProps } from '../../types and interfaces/types';


type RouteParamsTypes = {
  workoutType: string
}

const Focus = ({ route, navigation }: RouterProps) => {
  const { workoutType } = route?.params as RouteParamsTypes;
  const [focus, setFocus] = useState<"Strength" | "Hypertrophy">("Strength");
  const options: ("Strength" | "Hypertrophy")[]  = ["Strength", "Hypertrophy"];


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        <Text style={[globalStyles.label, {fontSize: 18}]}>What would you like to focus on?</Text>
        <View style={styles.radioButtonContainer}>
          <Radiobutton selectedValue={focus} setselectedValue={setFocus} options={options} />
        </View>
        <Pressable style={globalStyles.button} onPress={() =>{ navigation.navigate('Current Exercise',{workoutType: workoutType, focus:focus} ) } }>
          <Text style={globalStyles.buttonText}>Start Workout</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default Focus

const styles = StyleSheet.create({
  radioButtonContainer: {
    alignItems: 'center'
  },
});