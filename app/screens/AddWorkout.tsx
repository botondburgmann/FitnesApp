import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import SelectMenu from '../components/SelectMenu'
import { addExercise, addExperience, getExercises } from '../functions/databaseQueries'
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

interface UnilateralSet {
  // id: number;
   weightLeft: string;
   repsLeft: string;
   timeLeft: string;
   restTimeLeft: string;
   weightRight: string;
   repsRight: string;
   timeRight: string;
   restTimeRight: string;
 }

const AddWorkout = () => {
  const route = useRoute();
  const {userID} = route.params as RouteParams;

  const [date, setDate] = useState(new Date());

  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [numOfSet, setNumOfSet] = useState(0);

  // For bilateral sets
  const [biSet, setBiSet] = useState({
   // id: 0,
    weight: "",
    reps: "",
    time: "",
    restTime: ""
  })

  
  // For unilateral set
  const [uniSet, setUniSet] = useState({
    // id: 0,
    weightLeft: "",
    repsLeft: "",
    timeLeft: "",
    restTimeLeft: "",
    weightRight: "",
    repsRight: "",
    timeRight: "",
    restTimeRight: ""
  })
  
  const [sets, setSets] = useState([])


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

  
  function addUnilateralSet(set: UnilateralSet) {

    if (set.repsLeft === "" && set.repsRight === "")
      alert("Error: Reps fields cannot be empty. Please fill at least one of them");
    else {
      setSelectedExercises((prevSelected) => [...prevSelected, currentExercise]);
      console.log(selectedExercises);
      for (const key in set) {
        if (set.hasOwnProperty(key))
          set[key] === "" ? set[key] = 0 : set[key] = parseFloat(set[key]);
      }
      setSets((prevSets) => [...prevSets, set]);
      setUniSet({...set, weightLeft: "", repsLeft: "", timeLeft: "", restTimeLeft: "",weightRight: "", repsRight: "", timeRight: "", restTimeRight: ""})
      setNumOfSet((numOfSet) => {return numOfSet + 1})
    }
  }

  function addBilateralSet(set: BilateralSet) {    
    if (set.reps === "")
      alert("Error: reps field cannot be empty");
    else {
      //set.id += 1;
      setSelectedExercises((prevSelected) => [...prevSelected, currentExercise]);
      console.log(selectedExercises);
      
      for (const key in set) {
        if (set.hasOwnProperty(key))
          set[key] === "" ? set[key] = 0 : set[key] = parseFloat(set[key]);
      }
      setSets((prevSets) => [...prevSets, set]);
      setBiSet({...set, weight: "", reps: "", time: "", restTime: ""})
      setNumOfSet((numOfSet) => {return numOfSet + 1})
    }
  }

  function addSetToDatabase(numOfSet:number) {
    if (numOfSet > 0) {
      let typeOfSet: string;
      const uniqueCount = new Set(selectedExercises).size;
      if (uniqueCount > 1) {
        typeOfSet = "super"
      }
      else{
        let noRest = true
        for (const set of sets)
          if (set.restTime > 0 || (set.restTimeLeft > 0 && set.restTimeRight > 0)) {
          noRest = false;
          break;
        }
          if (noRest === true) {      
            const weights = [];
            for (const set of sets)
              weights.push(set.weight);
            let sorted = true;
            for (let i = 0; i < weights.length-1; i++)
              if (weights[i] < weights[i+1]) {            
                sorted = false;
                break;
              }
            sorted ? typeOfSet = "drop" : typeOfSet = "straight"
          }
            else
              typeOfSet = "straight"
      }
    
  
          
      let experiencePoints = 0;
      for (const set of sets) {
        if (set.weightLeft !== undefined || set.weightRight !== undefined) {
          if (set.weightLeft === 0) {
            experiencePoints += set.repsLeft;
          }
          else{
            experiencePoints += set.repsLeft * set.weightLeft;
          }
          if (set.weightRight === 0) {
            experiencePoints += set.repsRight;
          }
          else{
            experiencePoints += set.repsRight * set.weightRight;
          }
        }
        else{
          if (set.weight === 0) {
            experiencePoints += set.reps;
          }
          else
            experiencePoints += set.reps * set.weight;
        }
          
      }

      addExperience(userID, experiencePoints)
      addExercise(userID, date, selectedExercises, sets, typeOfSet);

      setSets([]);
      setCurrentExercise("");
      setSelectedExercises([]);
      setNumOfSet(0);
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
        setSelectedValue={ setCurrentExercise }
        />
      {exercises.find((exercise) => exercise.value === currentExercise)?.unilateral === true
      ?  <>
          <UnilateralSet set={uniSet} setSet={setUniSet}/>
          <Pressable onPress={() => addUnilateralSet(uniSet)}>
            <Text>Add another</Text>
          </Pressable>
          <Pressable onPress={() => addSetToDatabase(numOfSet)}>
            <Text>Finish set</Text>
          </Pressable>
        </>
      : exercises.find((exercise) => exercise.value === currentExercise)?.unilateral === false
      ? <>
          <BilateralSet set={biSet} setSet={setBiSet}/>
          <Pressable onPress={() => addBilateralSet(biSet)}>
            <Text>Add new set</Text>
          </Pressable>
          <Pressable onPress={() => addSetToDatabase(numOfSet)}>
            <Text>Finish set</Text>
          </Pressable>
        </>
      :<></>}
      <Text>Current set: {numOfSet}</Text>
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