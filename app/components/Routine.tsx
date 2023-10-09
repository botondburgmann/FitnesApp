import { StyleSheet, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { NavigationProp } from "@react-navigation/native";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const Routine = (props) => {
    const imageSource = props.imageSource;
    const navigation = props.navigation;
    const workoutType = props.workoutType;
  return (
    <Pressable style={styles.container} onPress={() => navigation.navigate('Focus')}>
        <Image style={styles.image} source={imageSource} />
        <Text>{workoutType}</Text>
    </Pressable>
  )
}

export default Routine

const styles = StyleSheet.create({
    container: {
    marginTop: 50,
    flexDirection:'row',
    justifyContent: 'space-evenly',
    backgroundColor:'green',    
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'red'

    },
    image: {
      width: 50,
      height: 100,
    },
  });