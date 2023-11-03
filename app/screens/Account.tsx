import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { getUser, getBestExercise } from '../functions/databaseQueries'
import UserContext from '../contexts/UserContext';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Account = ({ route, navigation }: RouterProps) => {
  const userID   = useContext(UserContext);

  let user = getUser(userID);
  let exerciseWithMostWeight = getBestExercise(userID,"weights", "reps");
  let exerciseWithMostReps =   getBestExercise(userID, "reps", "weights");
  
  
  
 
 const [experienceNeeded, setExperienceNeeded] = useState(0);
  useEffect(() => {
    user && setExperienceNeeded(Math.round(100*1.5**(user.level+1)-user.experience))
  
  }, [user])
  return (
    <View style={styles.container} >
          {user && <View>
            <Text style={styles.text}>{user.name}</Text>
            <Text style={styles.text}>Level: {user.level}</Text>
           <Text style={styles.text}>XP until next level: {experienceNeeded}</Text>

            <Text style={styles.text}>Best records</Text>
 
            <Text style={styles.text}>
              Weight: {( exerciseWithMostWeight).name} {( exerciseWithMostWeight).weights} kg ({(exerciseWithMostWeight).reps} repetitions)
            </Text>
            <Text style={styles.text}>
              Most repetitions: {( exerciseWithMostReps).name} {( exerciseWithMostReps).reps} repetitions ({( exerciseWithMostReps).weights} kg)
            </Text> 
          </View>} 

      
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