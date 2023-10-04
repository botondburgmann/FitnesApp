import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import SelectMenu from '../components/SelectMenu'
import { addExercise, getExercises } from '../functions/databaseQueries'
import UnilateralSet from '../components/UnilateralSet'
import BilateralSet from '../components/BilateralSet'

const AddWorkout = (props) => {
  const [date, setDate] = useState(new Date());

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");

  // For bilateral sets
  const [weights, setWeights] = useState([])
  const [reps, setReps] = useState([])
  const [times, setTimes] = useState([])
  const [restTimes, setRestTimes] = useState([])

  const [weight, setWeight] = useState("");
  const [rep, setRep] = useState("");
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
        const data = await getExercises(props.userID);
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
    addExercise(props.userID, date, exercises, sets);
    setLeftWeight("");
    setLeftReps("");
    setLeftTime("");
    setLeftRestTime("");
    setRightWeight("");
    setRightReps("");
    setRightTime("");
    setRightRestTime("");
  }

  function addBilateralSet(weight: Number, rep: Number, time: Number, restTime: Number) {

    //addExercise(props.userID, date, exercises, sets);
    setWeights([...weights,weight]); 
    setReps([...reps,rep]); 
    setTimes([...times,time]); 
    setRestTimes([...restTimes,restTime]); 

    console.log(weights);
    
    setWeight("");
    setRep("");
    setTime("");
    setRestTime("");
  }

  function addSetToDatabase() {
    const sets = {
      "weights" : weights,
      "reps" : reps,
      "time" : times,
      "restTime" : restTimes
      }

    console.log(sets);
    
    addExercise(props.userID, date, selectedExercise, sets);
    setWeights([]); 
    setReps([]); 
    setTimes([]); 
    setRestTimes([]); 
  }

  return (
    <View>
      <Datepicker date={date} changeDate={date => setDate(date)} />
      <Text>{date.toDateString()}</Text>
      <SelectMenu data={exercises} changeSelectedExercise={selectedExercise => setSelectedExercise(selectedExercise)}/>
      {exercises.find((exercise) => exercise.value === selectedExercise)?.unilateral === true
      ?  <>
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
            <Text>Add another</Text>
          </Pressable>
          <Pressable onPress={() => addUnilateralSet(selectedExercise, Number(leftWeight), Number(leftReps), Number(leftTime), Number(leftRestTime),
                                                                      Number(rightWeight), Number(rightReps), Number(rightTime), Number(rightRestTime))}>
            <Text>Finish set</Text>
          </Pressable>
        </>
      : exercises.find((exercise) => exercise.value === selectedExercise)?.unilateral === false
      ? <>
          <BilateralSet 
            weight={{ weight: weight, setWeight: setWeight }}
            rep={{ rep: rep, setRep: setRep }}
            time={{ time: time, setTime: setTime }}
            restTime={{ restTime: restTime, setRestTime: setRestTime }} 
          />
          <Pressable onPress={() => addBilateralSet(Number(weight), Number(rep), Number(time), Number(restTime))}>
            <Text>Add new set</Text>
          </Pressable>
          <Pressable onPress={() => addSetToDatabase()}>
            <Text>Finish set</Text>
          </Pressable>
        </>
      :<></>}
    </View>
  )
}

export default AddWorkout

const styles = StyleSheet.create({})