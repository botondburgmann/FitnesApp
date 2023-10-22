import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Radiobutton from '../components/Radiobutton';



const Focus = ({route}) => {
const { workoutType } = route?.params;
const [focus, setFocus] = useState<string>();
const options = ["Strength", "Hypertrophy", "Cardio"];
  return (
    <View style={styles.container}>
        <Radiobutton selectedValue={focus} setselectedValue={setFocus} options={options} />
        <Pressable style={styles.button}>
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