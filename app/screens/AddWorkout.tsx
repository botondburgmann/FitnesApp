import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import SelectMenu from '../components/SelectMenu'
import { addExercise, getExercises } from '../functions/databaseQueries'
import UnilateralSet from '../components/UnilateralSet'
import BilateralSet from '../components/BilateralSet'
import { NavigationProp, useRoute } from '@react-navigation/native'

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const AddWorkout = ({navigation}: RouterProps) => {
  const route = useRoute();
  const {userID} = route.params as RouteParams;

  const [date, setDate] = useState(new Date());

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");

  const [numOfSet, setNumOfSet] = useState(0);

  // For bilateral sets
  // Arrays of the whole set
  const [weights, setWeights] = useState([])
  const [reps, setReps] = useState([])
  const [times, setTimes] = useState([])
  const [restTimes, setRestTimes] = useState([])

  // Variables for the current set
  const [weight, setWeight] = useState("");
  const [rep, setRep] = useState("");
  const [time, setTime] = useState("");
  const [restTime, setRestTime] = useState(""); 


  // For unilateral sets
  // Arrays of the whole set
  const [leftWeights, setLeftWeights] = useState([]);
  const [leftReps, setLeftReps] = useState([]);
  const [leftTimes, setLeftTimes] = useState([]);
  const [leftRestTimes, setLeftRestTimes] = useState([]);
  const [rightWeights, setRightWeights] = useState([]);
  const [rightReps, setRightReps] = useState([]);
  const [rightTimes, setRightTimes] = useState([]);
  const [rightRestTimes  , setRightRestTimes] = useState([]);

  // Variables for the current set
  const [leftWeight, setLeftWeight] = useState("");
  const [leftRep, setLeftRep] = useState("");
  const [leftTime, setLeftTime] = useState("");
  const [leftRestTime, setLeftRestTime] = useState("");
  const [rightWeight, setRightWeight] = useState("");
  const [rightRep, setRightRep] = useState("");
  const [rightTime, setRightTime] = useState("");
  const [rightRestTime  , setRightRestTime] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExercises(userID);  
         const exerciseOptions = data.map((exercise) => ({
          label: exercise.name,
          value: exercise.name,
          unilateral: exercise.unilateral
        }));
        console.log(exerciseOptions);
        
        exerciseOptions && setExercises(exerciseOptions);
        
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchData();    
  }, [])

  function addUnilateralSet(leftWeight: number, leftRep: number, leftTime: number, leftRestTime: number, 
                            rightWeight: number, rightRep: number, rightTime: number, rightRestTime: number) {

    if (leftRep === 0 && rightRep === 0)
      alert("Error: Reps fields cannot be empty. Please fill at least one of them");
    else {
      setLeftWeights([...leftWeights, leftWeight]);
      setLeftReps([...leftReps, leftRep]);
      setLeftTimes([...leftTimes, leftTime]);
      setLeftRestTimes([...leftRestTimes, leftRestTime]);
      setRightWeights([...rightWeights, rightWeight]);
      setRightReps([...rightReps, rightRep]);
      setRightTimes([...rightTimes, rightTime]);
      setRightRestTimes([...rightRestTimes, rightRestTime]);

      setLeftWeight("");
      setLeftRep("");
      setLeftTime("");
      setLeftRestTime("");
      setRightWeight("");
      setRightRep("");
      setRightTime("");
      setRightRestTime("");
      setNumOfSet((numOfSet) => {return numOfSet + 1});
    }
  }

  function addBilateralSet(weight: number, rep: number, time: number, restTime: number) {

    if (rep === 0)
      alert("Error: reps field cannot be empty");
    else{
      setWeights([...weights,weight]); 
      setReps([...reps,rep]); 
      setTimes([...times,time]); 
      setRestTimes([...restTimes,restTime]); 
      
      setWeight("");
      setRep("");
      setTime("");
      setRestTime("");
      setNumOfSet((numOfSet) => {return numOfSet + 1});
    }
  }

  function addSetToDatabase(unilateral:boolean, numOfSet:number) {
    if (numOfSet > 0) {
      if (unilateral) {
        const sets = {
          "leftWeights" : leftWeights,
          "leftReps" : leftReps,
          "leftTime" : leftTimes,
          "leftRestTime" : leftRestTimes,
          "rightWeights" : rightWeights,
          "rightReps" : rightReps,
          "rightTime" : rightTimes,
          "rightRestTime" : rightRestTimes
        }
        addExercise(userID, date, selectedExercise, sets);
      }
      else{
        const sets = {
          "weights" : weights,
          "reps" : reps,
          "time" : times,
          "restTime" : restTimes
        }
        addExercise(userID, date, selectedExercise, sets);
      }    
  
      setWeights([]); 
      setReps([]); 
      setTimes([]); 
      setRestTimes([]); 
      setSelectedExercise("");
      setNumOfSet(0);
    } 
    else 
      alert("Not enough data");
  }

  return (
    <View style={styles.container}>
      <Datepicker date={date} changeDate={date => setDate(date)} />
      <Text>{date.toDateString()}</Text>
      <SelectMenu data={exercises} changeSelectedExercise={selectedExercise => setSelectedExercise(selectedExercise)}/>
      {exercises.find((exercise) => exercise.value === selectedExercise)?.unilateral === true
      ?  <>
          <UnilateralSet
            leftWeight={{ leftWeight: leftWeight, setLeftWeight: setLeftWeight }}
            leftRep={{ leftRep: leftRep, setLeftRep: setLeftRep }}
            leftTime={{ leftTime: leftTime, setLeftTime: setLeftTime }}
            leftRestTime={{ leftRestTime: leftRestTime, setLeftRestTime: setLeftRestTime }} 
            rightWeight={{ rightWeight: rightWeight, setRightWeight: setRightWeight }}
            rightRep={{ rightRep: rightRep, setRightRep: setRightRep }}
            rightTime={{ rightTime: rightTime, setRightTime: setRightTime }}
            rightRestTime={{ rightRestTime: rightRestTime, setRightRestTime: setRightRestTime }} 
          />
          <Pressable onPress={() => addUnilateralSet(Number(leftWeight), Number(leftRep), Number(leftTime), Number(leftRestTime),
                                                    Number(rightWeight), Number(rightRep), Number(rightTime), Number(rightRestTime))}>
            <Text>Add another</Text>
          </Pressable>
          <Pressable onPress={() => addSetToDatabase(true, numOfSet)}>
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
          <Pressable onPress={() => addSetToDatabase(false, numOfSet)}>
            <Text>Finish set</Text>
          </Pressable>
          <Text>Current set: {numOfSet}</Text>
        </>
      :<></>}
    </View>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      flex: 1,
  },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      padding: 10,
      width: 100
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
});