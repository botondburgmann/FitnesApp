import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SelectMenu from '../components/SelectMenu'
import { addExercise, addExperience, getExercises } from '../functions/databaseQueries'
import UnilateralSet from '../components/UnilateralSet'
import BilateralSet from '../components/BilateralSet'
import UserContext from '../contexts/UserContext'
import useFetch from '../hooks/useFetch'
import { useRoute } from '@react-navigation/native'




interface ExerciseSelectOption{
  label: string;
  value: string;
  unilateral: boolean
}

interface BilateralSet {
  weight: string;
  reps: string;
  time: string;
  restTime: string;
}

interface UnilateralSet {
  weightLeft: string;
  repsLeft: string;
  timeLeft: string;
  restTimeLeft: string;
  weightRight: string;
  repsRight: string;
  timeRight: string;
  restTimeRight: string;
 }

 type DateParams = {
    date: string; 
  };

const AddWorkout = () => {
  const userID = useContext(UserContext);

  const route = useRoute();
  const { date } = route.params as DateParams;

  const [allExercises, setAllExercises] = useState<ExerciseSelectOption[]>();
  const [currentExercise, setCurrentExercise] = useState<string>();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const [numOfSet, setNumOfSet] = useState(0);

  const [bilateralSet, setBilateralSet] = useState({
    weight: "", 
    reps: "",
    time: "",
    restTime: ""
  })

  const [unilateralSet, setUniSet] = useState({
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

  const {data:exercises, isPending:exercisesPending, error:exercisesError } = useFetch(getExercises, userID);

  
  useEffect(() => {
    if (!exercisesPending && !exercisesError && exercises) {
      const exerciseData = [];
      exercises.forEach(exercise => {
        if (!exercise.hidden) {          
          exerciseData.push({
            label: exercise.name,
            value: exercise.name,
            unilateral: exercise.unilateral,
          })
        }
      });
      setAllExercises(exerciseData);
    }
  }, [exercises, exercisesPending, exercisesError]);
   


  
  function addUnilateralSet(set: UnilateralSet) {
    if (set.repsLeft === "" && set.repsRight === "")
      alert("Error: Reps fields cannot be empty. Please fill at least one of them");
    else {
      setSelectedExercises((prevSelected) => [...prevSelected, currentExercise]);
      for (const key in set)
        set[key] === "" ? set[key] = 0 : set[key] = parseFloat(set[key]);

      setSets((prevSets) => [...prevSets, set]);
      setUniSet({...set, 
        weightLeft: "", 
        repsLeft: "", 
        timeLeft: "", 
        restTimeLeft: "",
        weightRight: "", 
        repsRight: "", 
        timeRight: "", 
        restTimeRight: ""
      })
      
        setNumOfSet((numOfSet) => {return numOfSet + 1})
    }
  }

  function addBilateralSet(set: BilateralSet) {    
    if (set.reps === "")
      alert("Error: reps field cannot be empty");
    else {
      setSelectedExercises((prevSelected) => [...prevSelected, currentExercise]);
      
      for (const key in set)
        set[key] === "" ? set[key] = 0 : set[key] = parseFloat(set[key]);
  
      setSets((prevSets) => [...prevSets, set]);
      setBilateralSet({...set, 
        weight: "", 
        reps: "", 
        time: "", 
        restTime: ""
      })
      setNumOfSet((numOfSet) => {return numOfSet + 1})
    }
  }

  function isSorted(weights:number[]) {
    let sorted = true;
    for (let i = 0; i < weights.length-1; i++)
      if (weights[i] < weights[i+1]) {            
        sorted = false;
        break;
      }
    return sorted;
  }

  function addUpWeights(sets) {
    const weights: number[] = [];
    for (const set of sets)
      weights.push(set.weight);
    return weights;
  }

  function isThereRest(sets) {
    let noRest = true
    for (let i = 0; i < sets.length-1; i++) {
      if (sets[i].restTime > 0 || (sets[i].restTimeLeft > 0 || sets[i].restTimeRight > 0)) {
        noRest = false;
        break;
      }
    }
    return noRest;
  }

  function areThereMultipleExercises(selectedExercises:string[]) {
    const selectedExercisesNumber = new Set(selectedExercises).size;
    if (selectedExercisesNumber > 1) 
      return true;
    return false;
  }
  function calculateExperiencePoints(sets) {
    let experiencePoints = 0;
    for (const set of sets) {
      if (set.weightLeft !== undefined || set.weightRight !== undefined) {
        if (set.weightLeft === 0)
          experiencePoints += set.repsLeft;
        else
          experiencePoints += set.repsLeft * set.weightLeft;
        if (set.weightRight === 0)
          experiencePoints += set.repsRight;
        else
          experiencePoints += set.repsRight * set.weightRight;
      }
      else{
        if (set.weight === 0)
          experiencePoints += set.reps;
        else
          experiencePoints += set.reps * set.weight;
      }
    }

    return experiencePoints;
  }

  function addSetToDatabase(numOfSet:number) {
    if (numOfSet > 0) {
      let typeOfSet: string;
      if (numOfSet === 1){
        typeOfSet = "straight"
      }
      else if (areThereMultipleExercises(selectedExercises)) {
        typeOfSet = "super";
      }
      else{
        if (isThereRest(sets)) {      
          const weights = addUpWeights(sets);
          const sorted = isSorted(weights);
          sorted ? typeOfSet = "drop" : typeOfSet = "straight"
        }
        else
          typeOfSet = "straight"
      }
    
      const experiencePoints = calculateExperiencePoints(sets);  

      addExperience(userID, Math.round(experiencePoints))
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

      <SelectMenu 
        data={allExercises || []} 
        setSelectedValue={ setCurrentExercise }
      />
      {allExercises && allExercises.find((exercise) => exercise.value === currentExercise)?.unilateral === true
      ?  <>
          <UnilateralSet set={unilateralSet} setSet={setUniSet}/>
         
          <Pressable onPress={() => addUnilateralSet(unilateralSet)}>
            <Text>Add another</Text>
          </Pressable>
         
          <Pressable onPress={() => addSetToDatabase(numOfSet)}>
            <Text>Finish set</Text>
          </Pressable>
        </>
      : allExercises && allExercises.find((exercise) => exercise.value === currentExercise)?.unilateral === false
      ? <>
          <BilateralSet set={bilateralSet} setSet={setBilateralSet}/>
         
          <Pressable onPress={() => addBilateralSet(bilateralSet)}>
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
    backgroundColor: '#ff0000'

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