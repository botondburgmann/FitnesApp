import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { getExperienceNeeded, getLevel, getExerciseWithMostReps, getName,getExerciseWithMostWeight } from '../functions/databaseQueries'
import UserContext from '../contexts/UserContext';
import useFetch from '../hooks/useFetch';


const Account = () => {
  const userID   = useContext(UserContext);

  const {data:name, isPending:namePending, error: nameError } = useFetch(getName, userID);
  const {data:level, isPending:levelPending, error:levelError } = useFetch(getLevel, userID);
  const {data:experienceNeeded, isPending:experienceNeededPending, error:experienceNeededError } = useFetch(getExperienceNeeded, userID);
  const {data:exerciseWithMostWeight, isPending:exerciseWithMostWeightPending, error:exerciseWithMostWeightError } = useFetch(getExerciseWithMostWeight, userID);
  const {data:exerciseWithMostReps, isPending:exerciseWithMostRepsPending, error:exerciseWithMostRepsError } = useFetch(getExerciseWithMostReps, userID);

  
  return (
    <View style={styles.container} >
{/*       {nameError && <Text style={styles.text}>{nameError}</Text>}
      {namePending && <Text style={styles.text}>Loading your name...</Text>}
      {name && <Text style={styles.text}>{name}</Text>}

      {levelError && <Text style={styles.text}>{levelError}</Text>}
      {levelPending && <Text style={styles.text}>Loading your level...</Text>}
      {level && <Text style={styles.text}>Level: {level}</Text>}

      {experienceNeededError && <Text style={styles.text}>{experienceNeededError}</Text>}
      {experienceNeededPending && <Text style={styles.text}>Loading how many experience you need...</Text>}
      {experienceNeeded && <Text style={styles.text}>XP until next level: {experienceNeeded}</Text>}

      <Text style={styles.text}>Best records</Text>

      {exerciseWithMostWeightError && <Text style={styles.text}>{exerciseWithMostWeightError}</Text>}
      {exerciseWithMostWeightPending && <Text style={styles.text}>Loading your strongest exercise...</Text>}
      {exerciseWithMostWeight && 
      <Text style={styles.text}>
        Weight: {exerciseWithMostWeight.name} {exerciseWithMostWeight.weight} kg ({exerciseWithMostWeight.reps} repetitions)
      </Text>}

      {exerciseWithMostRepsError && <Text style={styles.text}>{exerciseWithMostRepsError}</Text>}
      {exerciseWithMostRepsPending && <Text style={styles.text}>Loading your exercise with the most repetitions done...</Text>}
      {exerciseWithMostReps && 
      <Text style={styles.text}>
        Most repetitions: {exerciseWithMostReps.name} {exerciseWithMostReps.reps} repetitions ({exerciseWithMostReps.weight} kg)
      </Text>}
      
      <Text style={styles.text}>Achievements</Text>
      */}
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