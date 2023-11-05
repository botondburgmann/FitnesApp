import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Radiobutton from '../components/Radiobutton';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Focus = ({ route, navigation }: RouterProps) => {
const { workoutType } = route?.params;
const [focus, setFocus] = useState<string>();
const options = ["Strength", "Hypertrophy"];
  return (
    <View style={styles.container}>
        <Radiobutton selectedValue={focus} setselectedValue={setFocus} options={options} />
        <Pressable style={styles.button} onPress={() => navigation.navigate('CurrentExercise',{workoutType: workoutType, focus:focus})}>
          <Text style={styles.text}>Start Workout</Text>
      </Pressable>
    </View>
  )
}

export default Focus

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
  },
  button:{
    width: 250,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "#000",
  },
});