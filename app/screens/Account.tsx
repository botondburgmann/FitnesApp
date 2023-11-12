import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig'
import { getUser, getBestExercise } from '../functions/databaseQueries'
import UserContext from '../contexts/UserContext';
import { NavigationProp } from '@react-navigation/native';
import { MyUser, BestExercise } from '../types and interfaces/types';
import { onSnapshot, query, collection, where } from 'firebase/firestore';

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Account = ({ route, navigation }: RouterProps) => {
  const userID   = useContext(UserContext);

  const [user, setUser] = useState<MyUser>({
    activityLevel: "",
    age: 0,
    experience: 0,
    gender: "",
    height: 0,
    level: 0,
    name: "",
    weeklyExperience:0,
    weight: 0
  });
  const [mostWeightExercise, setmostWeightExercise] = useState<BestExercise>({
    name: "",
    weights: 0,
    reps: 0
})
  const [mostRepsExercise, setmostRepsExercise] = useState<BestExercise>({
    name: "",
    weights: 0,
    reps: 0
})

useEffect(() => {
  const unsubscribeFromUser = getUser(userID, (userData) => {
    setUser(userData);
  });
  const unsubscribeFromMostWeight = getBestExercise(userID, "weights", "reps", (exerciseData) => {
    setmostWeightExercise(exerciseData);
  });
  const unsubscribeFromMostReps = getBestExercise(userID, "reps", "weight", (exerciseData) => {
    setmostRepsExercise(exerciseData);
  });


  return () => {
    unsubscribeFromUser();
    unsubscribeFromMostWeight();
    unsubscribeFromMostReps();
    setUser({
      activityLevel: "",
      age: 0,
      experience: 0,
      gender: "",
      height: 0,
      level: 0,
      name: "",
      weeklyExperience:0,
      weight: 0
    });
    setmostWeightExercise({
      name: "",
      weights: 0,
      reps: 0
    });
    setmostRepsExercise({
      name: "",
      weights: 0,
      reps: 0
    })
  }
},[userID])

  
  
  
 
 const [experienceNeeded, setExperienceNeeded] = useState(0);
  useEffect(() => {
    user && setExperienceNeeded(Math.round(100*1.5**(user.level+1)-user.experience))
  
  }, [user])
  return (
    <View style={styles.container} >
   <View>
            <Text style={styles.text}>{user.name}</Text>
            <Text style={styles.text}>Level: {user.level}</Text>
            <Text style={styles.text}>XP until next level: {experienceNeeded}</Text>

            <Text style={styles.text}>Best records</Text>

           {/*  <Text style={styles.text}>
              Weight: {( mostWeightExercise).name} {( mostWeightExercise).weights} kg ({(mostWeightExercise).reps} repetitions)
            </Text>
            <Text style={styles.text}>
              Most repetitions: {( mostRepsExercise).name} {( mostRepsExercise).reps} repetitions ({( mostRepsExercise).weights} kg)
            </Text>  */}
          </View>

      

      
      <Pressable style={styles.button}>
          <Text style={styles.text} onPress={() => navigation.navigate("Edit profile", {user: user})}>Edit profile</Text>
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