import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { getExperience, getLevel, getName,getStrongestExercise } from '../functions/databaseQueries'
import { useRoute } from '@react-navigation/native';


interface RouteParams {
  userID: string;
}


const Account = () => {
  const route = useRoute();

  const {userID} = route.params as RouteParams;

  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);
  const [experience, setExperience] = useState(0);
  const [experienceNeeded, setExperienceNeeded] = useState(0);
  const [mostWeight, setmostWeight] = useState({
    name: "",
    weight: 0,
    reps: 0,
  })
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const strongest = await getStrongestExercise(userID);
        if (strongest === undefined) {
          console.log("not loaded");
          
        } else {
          setmostWeight({...mostWeight, weight: strongest.weight, name: strongest.name, reps: strongest.reps})
          console.log("In account:", strongest);         
        }
        

        const name = await getName(userID);  
        const level = await getLevel(userID);
        const experience = await getExperience(userID);

                

        name && setName(name);
        level && setLevel(level);
        experience && setExperience(experience);
        experience && setExperienceNeeded(Math.round(100*1.5**(level+1)-experience));
        
        
        
        
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    fetchData();    
  }, [])
  
  return (
    <View style={styles.container} >
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.text}>Level: {level}</Text>
      <Text style={styles.text}>XP until next level: {experienceNeeded}</Text>
      <Text style={styles.text}>Best records</Text>
      <Text style={styles.text}>Most Weight: {mostWeight.name} {mostWeight.weight} kg {mostWeight.reps} repetitions</Text>
      <Text style={styles.text}>Most repetitions</Text>
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