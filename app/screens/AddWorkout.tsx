import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import SelectMenu from '../components/SelectMenu'
import { addExercise, getExercises } from '../functions/databaseQueries'
import UnilateralSet from '../components/UnilateralSet'
import BilateralSet from '../components/BilateralSet'
import { useRoute } from '@react-navigation/native'



interface RouteParams {
  userID: string;
}

interface BilateralSet {
 // id: number;
  weight: string;
  reps: string;
  time: string;
  restTime: string;
}


const AddWorkout = () => {
  const route = useRoute();
  const {userID} = route.params as RouteParams;

  const [date, setDate] = useState(new Date());

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");

  const [numOfSet, setNumOfSet] = useState(0);

  // For bilateral sets
  // New
  const [set, setSet] = useState({
   // id: 0,
    weight: "",
    reps: "",
    time: "",
    restTime: ""
  })

  const [sets, setSets] = useState([])

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

  function addBilateralSet(set: BilateralSet) {    
    if (set.reps === "")
      alert("Error: reps field cannot be empty");
    else {
      //set.id += 1;
      for (const key in set) {
        if (set.hasOwnProperty(key))
          set[key] === "" ? set[key] = 0 : set[key] = parseInt(set[key]);
      }
      setSets((prevSets) => [...prevSets, set]);
      console.log(sets);
      setSet({...set, weight: "", reps: "", time: "", restTime: ""})
      setNumOfSet((numOfSet) => {return numOfSet + 1})
    }
  }

  function addSetToDatabase(unilateral:boolean, numOfSet:number) {
    if (numOfSet > 0) {
      if (unilateral) {
        return

      }
      else
        addExercise(userID, date, selectedExercise, sets);

      setSets([]);
      setSelectedExercise("");
    } 
    else 
      alert("Not enough data");
  }

  return (
    <View style={styles.container}>
      <Datepicker date={date} changeDate={date => setDate(date)} />
      <Text>{date.toDateString()}</Text>
      <SelectMenu 
        data={exercises} 
        setSelectedValue={ setSelectedExercise }
        />
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
          <BilateralSet set={set} setSet={setSet}/>
          <Pressable onPress={() => addBilateralSet(set)}>
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