import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import Datepicker from '../components/Datepicker'
import UserContext from '../contexts/UserContext';
import useFetch from '../hooks/useFetch';
import { deleteExercise, getWorkout } from '../functions/databaseQueries';
import DisplayDropSet from '../components/DisplayDropSet';
import DisplayStraightSet from '../components/DisplayStraightSet';
import DisplaySuperSet from '../components/DisplaySuperSet';



interface RouterProps {
  navigation: NavigationProp<any, any>;
}


const Workouts = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [date, setDate] = useState(new Date());

  const {data: workout, isPending: workoutPending, error: workoutError} = useFetch(getWorkout, userID, date.toDateString())
        
  const [exerciseComponents, setExerciseComponents] = useState([])

  useEffect(() => {
    setExerciseComponents([]);

    if (workout) {
      const workoutInOrder = sortArrays(workout, workout.timeStamps.slice());
      for (let i = 0; i < workoutInOrder.exercises.length; i++) {
        if (workoutInOrder.typeOfSets[i] === "straight" )
          setExerciseComponents((prev) => [...prev,<DisplayStraightSet key={i} deleteSets={handleDelete} exercise={workoutInOrder.exercises[i][0]} sets={workoutInOrder.sets[i]} id={workoutInOrder.ids[i]}/> ])
        else if (workoutInOrder.typeOfSets[i] === "drop" )
          setExerciseComponents((prev) => [...prev,<DisplayDropSet  key={i} deleteSets={handleDelete} exercise={workoutInOrder.exercises[i][0]} sets={workoutInOrder.sets[i]} id={workoutInOrder.ids[i]}/>])
        else if ((workoutInOrder.typeOfSets[i] === "super"))
          setExerciseComponents((prev) => [...prev,<DisplaySuperSet  key={i} deleteSets={handleDelete} exercises={workoutInOrder.exercises[i]} sets={workoutInOrder.sets[i]} id={workoutInOrder.ids[i]}/>])
      }
    }
  
    function sortArrays(workout, keyArray) {
      const indices = keyArray.map((_, index) => index);
        
      indices.sort((a, b) => (workout.timeStamps[a].nanoseconds + workout.timeStamps[a].seconds * 1e9) -(workout.timeStamps[b].nanoseconds + workout.timeStamps[b].seconds * 1e9));
        
      for (const prop in workout) 
        if (prop !== 'timeStamps') 
          workout[prop] = indices.map((index) => workout[prop][index]);
          
      workout.timeStamps = keyArray.sort((a, b) => a - b);
        
      return workout;
    }
   
 
  }, [workout])
  

  function handleDelete(id,sets) {
    deleteExercise(userID, id, calculateXP(sets))
    const updatedExerciseComponents = exerciseComponents.filter((component) => component.props.id !== id);
    setExerciseComponents(updatedExerciseComponents);
  }

  function calculateXP(sets) {
    let experiencePoints = 0;
    for (const set of sets) {
      if (set.weightLeft !== undefined || set.weightRight !== undefined) {
        if (set.weightLeft === 0)
          experiencePoints -= set.repsLeft;
        else
          experiencePoints -= set.repsLeft * set.weightLeft;
        if (set.weightRight === 0)
          experiencePoints -= set.repsRight;
        else
          experiencePoints -= set.repsRight * set.weightRight;
      }
      else{
        if (set.weight === 0)
          experiencePoints -= set.reps;
        else
          experiencePoints -= set.reps * set.weight;
      }
    }

  return experiencePoints;  
  }


  
  return (
    <View style={styles.container}>
      <Datepicker date={date} setDate={setDate} />
      <Text style={[styles.text, {marginTop: 20}]}>{date.toDateString()}</Text>
      <ScrollView contentContainerStyle={styles.log}>
        {workoutError && <Text style={[styles.text, {marginTop: 20}]}>{workoutError}</Text> }
        {workoutPending && <Text style={[styles.text, {marginTop: 20}]}>Loading...</Text>}
        {workout && exerciseComponents}
      </ScrollView>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Add',{ date: date.toDateString()})}>
          <Text style={styles.text}>Add new Exercise</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Routine')}>
          <Text style={styles.text}>Ask for routine</Text>
        </Pressable>
      </View>     
    </View>
  )
}

export default Workouts

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
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
button:{
    width: 100,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#000",
},

label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: -80,
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 40
  },
  buttonGroup: {
   flexDirection: 'row',
   justifyContent: 'space-evenly', 
   marginVertical: 20
  },
  inputGroup:{
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
  },
  selectMenuContainer: {
   flex: 0.5, //
   backgroundColor: "#fff",
   padding: 5
  },
  icon: {
   alignSelf: 'center',
   fontSize: 18,
   color: "#fff",
   marginBottom: 50,
  },
  log:{
    justifyContent:'flex-end',
  },
});