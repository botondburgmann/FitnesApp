import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'


const Rest = (props) => {
  const setGoToNextPage = props.setGoToNextPage
  const setSets = props.setSets;
  const exercise = props.exercise;
  const duration = exercise.musclesWorked.length > 1 ? 10 : 20;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rest</Text>
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[30, 25, 10, 0]}
        onComplete={() => {
          const newSet = {
            exercise: [],
            weights: [],
            reps: [],
            times: [],
            restTimes: exercise.unilateral ? [30, 30] : [30],
            sides: [],
        }
        setSets(prevSets => ({
            ...prevSets,
            exercise: [...prevSets.exercise, ...newSet.exercise],
            weights: [...prevSets.weights, ...newSet.weights],
            reps: [...prevSets.reps, ...newSet.reps],
            times: [...prevSets.times, ...newSet.times],
            restTimes: [...prevSets.restTimes, ...newSet.restTimes],
            sides: [...prevSets.sides, ...newSet.sides],
          }));
          setGoToNextPage(true)
        }}
      >
        {({ remainingTime }) =><Text style={styles.text}>{Math.floor(remainingTime / 60)}:{remainingTime % 60}</Text>}
      </CountdownCircleTimer>
    </View>
  )
}

export default Rest

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: 'center',
      backgroundColor: '#ff0000'
  },
  input: {
      marginHorizontal: 10,
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
  },
  text:{
      alignSelf: 'center',
      fontSize: 18,
      color: "#fff",
      textTransform: 'uppercase',
      fontWeight: "600",
      paddingVertical: 10,
  },
  gridContainer:{
      flexDirection: 'row',
      marginHorizontal: 10,
      justifyContent: 'center'
  },
  button:{
      width: 100,
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignSelf: "center",
      backgroundColor: "#000",
  },
  label: {
      fontSize: 20,
      fontWeight: "800",
      color: "#fff",
      textTransform: 'uppercase',
      textAlign: 'center',
      marginVertical: 50
  },
});