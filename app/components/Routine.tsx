import { StyleSheet, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import NavigationContext from '../contexts/NavigationContext';
import { globalStyles } from '../assets/styles';

const Routine = (props: { workoutType: string; }) => {
  const navigation = useContext(NavigationContext);
  const workoutType = props.workoutType;

  return (
    <Pressable style={styles.container} onPress={() => {navigation !== null && navigation.navigate('Focus',{workoutType: workoutType})}}>
        <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 30, fontWeight: "800"}]}>{workoutType} workout</Text>
    </Pressable>
  )
}

export default Routine

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection:'row',
    justifyContent: 'space-evenly',
    backgroundColor:'rgba(255,0,0,0.7)',    
    alignItems: 'center',
  },
});