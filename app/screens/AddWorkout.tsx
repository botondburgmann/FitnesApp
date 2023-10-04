import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import SelectMenu from '../components/SelectMenu'
import { addExercise, getExercises } from '../functions/databaseQueries'
import UnilateralSet from '../components/UnilateralSet'
import BilateralSet from '../components/BilateralSet'

const AddWorkout = () => {
  const [date, setDate] = useState(new Date());

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");

  // For bilateral sets
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [restTime, setRestTime] = useState("");

  // For unilateral sets
  const [leftWeight, setLeftWeight] = useState("");
  const [leftReps, setLeftReps] = useState("");
  const [leftTime, setLeftTime] = useState("");
  const [leftRestTime, setLeftRestTime] = useState("");
  const [rightWeight, setRightWeight] = useState("");
  const [rightReps, setRightReps] = useState("");
  const [rightTime, setRightTime] = useState("");
  const [rightRestTime  , setRightRestTime] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExercises("id");
        const exerciseOptions = data.map((exercise) => ({
          label: exercise.name,
          value: exercise.name,
          unilateral: exercise.unilateral
        }));
        setExercises(exerciseOptions);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchData();
  }, [])

  function addUnilateralSet(exercises: (string | Array<string>), leftWeight: Number, leftReps: Number, leftTime: Number, leftRestTime: Number, 
                                                                rightWeight: Number, rightReps: Number, rightTime: Number, rightRestTime: Number) {
    const sets = {
      "leftWeights" : [leftWeight],
      "leftReps" : [leftReps],
      "leftTime" : [leftTime],
      "leftRestTime" : [leftRestTime],
      "rightWeights" : [rightWeight],
      "rightReps" : [rightReps],
      "rightTime" : [rightTime],
      "rightRestTime" : [rightRestTime]
    }
    addExercise("sdfdfsf", date, exercises, sets);
    setLeftWeight("");
    setLeftReps("");
    setLeftTime("");
    setLeftRestTime("");
    setRightWeight("");
    setRightReps("");
    setRightTime("");
    setRightRestTime("");
  }

  function addBilateralSet(exercises: (string | Array<string>), weight: Number, reps: Number, time: Number, restTime: Number) {
    const sets = {
    "weights" : [weight],
    "reps" : [reps],
    "time" : [time],
    "restTime" : [restTime]
    }
    addExercise("sdfdfsf", date, exercises, sets);
    setWeight("");
    setReps("");
    setTime("");
    setRestTime("");
  }

  return (
    <View>
      <Datepicker date={date} changeDate={date => setDate(date)} />
      <Text>{date.toDateString()}</Text>
      <SelectMenu data={exercises} changeSelectedExercise={selectedExercise => setSelectedExercise(selectedExercise)}/>
      {exercises.find((exercise) => exercise.value === selectedExercise)?.unilateral 
      ? <>
          <UnilateralSet
            leftWeight={{ leftWeight: leftWeight, setLeftWeight: setLeftWeight }}
            leftReps={{ leftReps: leftReps, setLeftReps: setLeftReps }}
            leftTime={{ leftTime: leftTime, setLeftTime: setLeftTime }}
            leftRestTime={{ leftRestTime: leftRestTime, setLeftRestTime: setLeftRestTime }} 
            rightWeight={{ rightWeight: rightWeight, setRightWeight: setRightWeight }}
            rightReps={{ rightReps: rightReps, setRightReps: setRightReps }}
            rightTime={{ rightTime: rightTime, setTime: setTime }}
            rightRestTime={{ rightRestTime: rightRestTime, setRightRestTime: setRightRestTime }} 
          />
          <Pressable onPress={() => addUnilateralSet(selectedExercise, Number(leftWeight), Number(leftReps), Number(leftTime), Number(leftRestTime),
                                                                      Number(rightWeight), Number(rightReps), Number(rightTime), Number(rightRestTime))}>
            <Text>Add</Text>
          </Pressable>
        </>
      : !exercises.find((exercise) => exercise.value === selectedExercise)?.unilateral 
      ? <>
          <BilateralSet 
            weight={{ weight: weight, setWeight: setWeight }}
            reps={{ reps: reps, setReps: setReps }}
            time={{ time: time, setTime: setTime }}
            restTime={{ restTime: restTime, setRestTime: setRestTime }} 
          />
          <Pressable onPress={() => addBilateralSet(selectedExercise, Number(weight), Number(reps), Number(time), Number(restTime))}>
            <Text>Add</Text>
          </Pressable>
        </>
      :<></>}
    </View>
  )
}

export default AddWorkout

const styles = StyleSheet.create({})