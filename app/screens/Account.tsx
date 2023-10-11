import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { getExperience, getLevel, getExerciseWithMostReps, getName,getExerciseWithMostWeight } from '../functions/databaseQueries'
import { useRoute } from '@react-navigation/native';


interface RouteParams {
  userID: string;
}

interface Exercise {
  name: string;
  weight: number;
  reps: number;
}

const Account = () => {
  const route = useRoute();

  const {userID} = route.params as RouteParams;

  const [name, setName] = useState<string>();
  const [level, setLevel] = useState<number>();
  const [experienceNeeded, setExperienceNeeded] = useState<number>();
  const [exerciseWithMostWeight, setExerciseWithMostWeight] = useState<Exercise>();
  const [exerciseWithMostReps, setExerciseWithMostReps] = useState<Exercise>()
 

  useEffect(() => {

    const calculateExperienceNeeded = (level:number, currentExperience:number) => {
      return Math.round(100*1.5**(level+1)-currentExperience)
    }

    const fetchData = async () => {
      try {
        const name = await getName(userID);  
        const level = await getLevel(userID);
        const experience = await getExperience(userID);
        const exerciseWithMostWeight = await getExerciseWithMostWeight(userID);
        const exerciseWithMostReps = await getExerciseWithMostReps(userID);

        name && setName(name);
        level && setLevel(level);
        experience && setExperienceNeeded(calculateExperienceNeeded(level, experience));
        exerciseWithMostWeight && 
        setExerciseWithMostWeight({
          weight: exerciseWithMostWeight.weight, 
          name: exerciseWithMostWeight.name, 
          reps: exerciseWithMostWeight.reps
        })
        exerciseWithMostReps && 
        setExerciseWithMostReps({
          weight: exerciseWithMostReps.weight, 
          name: exerciseWithMostReps.name, 
          reps: exerciseWithMostReps.reps
        })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();    
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