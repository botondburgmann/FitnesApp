import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Radiobutton from '../components/Radiobutton';
import { NavigationProp } from '@react-navigation/native';
import { backgroundImage, globalStyles } from '../assets/styles';

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Focus = ({ route, navigation }: RouterProps) => {
const { workoutType } = route?.params;
const [focus, setFocus] = useState<string>();
const options = ["Strength", "Hypertrophy"];

function handleStartButtonPress(navigation:NavigationProp<any, any>, workoutType: string, focus: string) {
  if (focus !== undefined) {
    navigation.navigate('CurrentExercise',{workoutType: workoutType, focus:focus})
  }
  else
    alert("Please choose an option");
}

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
          <Text style={[globalStyles.label, {fontSize: 18}]}>What would you like to focus on?</Text>
          <View style={styles.radioButtonContainer}>
            <Radiobutton selectedValue={focus} setselectedValue={setFocus} options={options} />
          </View>
          <Pressable style={globalStyles.button} onPress={() => handleStartButtonPress(navigation,workoutType,focus) }>
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