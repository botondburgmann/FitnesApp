import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Exercise, ExerciseSet } from '../types and interfaces/types'
import { globalStyles } from '../assets/styles'


const Rest = (props: { setGoToNextPage: Function; currentExercise: ExerciseSet; exercise: Exercise }) => {
  const setGoToNextPage = props.setGoToNextPage
  const currentExercise: ExerciseSet = props.currentExercise;
  const exercise = props.exercise;
  const duration = exercise.musclesWorked.length > 1 ? 180 : 120;

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.label, {marginVertical: 50}]}>Rest</Text>
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[30, 25, 10, 0]}
        onComplete={() => {
          if (exercise.unilateral)
            currentExercise.restTimes.push(...[0, duration]);
          else                
            currentExercise.restTimes.push(duration);
          setGoToNextPage(true)
        }}
      >
        {({ remainingTime }) =><Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>{Math.floor(remainingTime / 60)}:{remainingTime % 60}</Text>}
      </CountdownCircleTimer>
    </View>
  )
}

export default Rest

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: 'center',
  },
});