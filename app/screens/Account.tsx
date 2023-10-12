import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { getExperienceNeeded, getLevel, getExerciseWithMostReps, getName,getExerciseWithMostWeight } from '../functions/databaseQueries'
import UserContext from '../contexts/UserContext';



interface BestExercise {
  name: string;
  weight: number;
  reps: number;
}

const Account = () => {

  const userID   = useContext(UserContext);

  const [name, setName] = useState<string>();
  const [level, setLevel] = useState<number>();
  const [experienceNeeded, setExperienceNeeded] = useState<number>();
  const [exerciseWithMostWeight, setExerciseWithMostWeight] = useState<BestExercise>();
  const [exerciseWithMostReps, setExerciseWithMostReps] = useState<BestExercise>()
 

  useEffect(() => {
    const fetchData =async (data:string, fetcher: Function, userID: string): Promise<any> => {
      try {
        const data = await fetcher(userID);  
        return data;
      } catch (error) {
        alert("Error fetching data: " + error);
      }
    }
    const setField =async (setter: Function, value: Promise<any>) => {
      try {
        setter(await value);
      } catch (error) {
        alert("Error setting data: " + error);
      }   
    }

    const name = fetchData('name', getName, userID);
    const level = fetchData('level', getLevel, userID);
    const experienceNeeded = fetchData('experience', getExperienceNeeded, userID);
    const exerciseWithMostWeight = fetchData('exerciseWithMostWeight', getExerciseWithMostWeight,userID);
    const exerciseWithMostReps = fetchData('exerciseWithMostReps', getExerciseWithMostReps,userID);

    setField(setName, name);
    setField(setLevel, level);
    setField(setExperienceNeeded, experienceNeeded);
    setField(setExerciseWithMostWeight, exerciseWithMostWeight);
    setField(setExerciseWithMostReps, exerciseWithMostReps);
  }, [exerciseWithMostWeight])
  
  return (
    <View style={styles.container} >
      {name && <Text style={styles.text}>{name}</Text>}
      {level && <Text style={styles.text}>Level: {level}</Text>}
      {experienceNeeded && <Text style={styles.text}>XP until next level: {experienceNeeded}</Text>}

      <Text style={styles.text}>Best records</Text>
      {exerciseWithMostWeight && 
      <Text style={styles.text}>
        Weight: {exerciseWithMostWeight.name} {exerciseWithMostWeight.weight} kg ({exerciseWithMostWeight.reps} repetitions)
      </Text>}
      {exerciseWithMostReps && 
      <Text style={styles.text}>
        Most repetitions: {exerciseWithMostReps.name} {exerciseWithMostReps.reps} repetitions ({exerciseWithMostReps.weight} kg)
      </Text>}
      
      <Text style={styles.text}>Achievements</Text>
      
      <Pressable style={styles.button}>
          <Text style={styles.text}>Edit profile</Text>
      </Pressable>
      <Pressable style={styles.button}>
          <Text style={styles.text} onPress={() => FIREBASE_AUTH.signOut()}>Log out</Text>
      </Pressable>
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: '#ff0000'
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
    width: 250,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "#000",
},
});