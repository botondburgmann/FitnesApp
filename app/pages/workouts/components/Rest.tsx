import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useRef } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Exercise, Sets, SingleSet } from '../../../types and interfaces/types'
import { globalStyles } from '../../../assets/styles'
import { addXP, finishExercise } from '../workoutsFunction'
import UserContext from '../../../contexts/UserContext'
import WeekContext from '../../../contexts/WeekContext'


const Rest = (props: { setCompletedSet: Function; sets:  React.MutableRefObject<Sets>; exercise: Exercise, isLastSetOfExercise: boolean, totalXP: React.MutableRefObject<number> }) => {
  const userID = useContext(UserContext);
  const week = useContext(WeekContext)
  const setCompletedSet = props.setCompletedSet
  const sets = props.sets;
  const totalXP = props.totalXP;
  const exercise = props.exercise;
  const isLastSetOfExercise = props.isLastSetOfExercise;
  const duration = exercise.musclesWorked.length > 1 ? 3 : 2;

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.label, {marginVertical: 50}]}>Rest</Text>
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={['#FF0000', '#FF0000', '#FF0000', '#FF0000']}
        colorsTime={[30, 25, 10, 0]}
        onComplete={() => {
          const lastSet: SingleSet = {
            exercise: sets.current.exercise[sets.current.exercise.length-1],
            reps: sets.current.reps[sets.current.reps.length-1],
            restTime: sets.current.restTimes[sets.current.restTimes.length-1],
            side: sets.current.sides[sets.current.sides.length-1],
            time: sets.current.times[sets.current.times.length-1],
            weight: sets.current.weights[sets.current.weights.length-1]
          }
          if (exercise.unilateral) {
            sets.current.restTimes.push(...[0, duration]);

            totalXP.current += addXP(exercise.isometric, lastSet)
            totalXP.current += addXP(exercise.isometric, lastSet)
          }
          else {
            sets.current.restTimes.push(duration);

            totalXP.current += addXP(exercise.isometric, lastSet)
          }
          setCompletedSet(false)
          if (isLastSetOfExercise && userID && week) {            
            finishExercise(sets.current, userID, new Date(), week, totalXP.current );
            sets.current = {
              exercise : [],
              dates: [],
              weights: [],
              reps: [],
              times: [],
              restTimes: [],
              sides: []
            }
            totalXP.current = 0;
          }
          
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