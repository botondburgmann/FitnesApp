import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Radiobutton from '../components/Radiobutton';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../assets/styles';

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Focus = ({ route, navigation }: RouterProps) => {
const { workoutType } = route?.params;
const [focus, setFocus] = useState<string>();
const options = ["Strength", "Hypertrophy"];
  return (
    <View style={[globalStyles.container, {flex: 1}]}>
        <Text style={styles.label}>What would you like to focus on?</Text>
        <View style={styles.radioButtonContainer}>
          <Radiobutton selectedValue={focus} setselectedValue={setFocus} options={options} />
        </View>
        <Pressable style={globalStyles.button} onPress={() => navigation.navigate('CurrentExercise',{workoutType: workoutType, focus:focus})}>
          <Text style={globalStyles.buttonText}>Start Workout</Text>
      </Pressable>
    </View>
  )
}

export default Focus

const styles = StyleSheet.create({
  radioButtonContainer: {
    alignItems: 'center'
  },
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
  },
  label: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginVertical: 10,
    textAlign: 'center',
    lineHeight: 40
  },
});