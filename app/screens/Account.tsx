import { ImageBackground, Pressable, Text, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { FIREBASE_AUTH } from "../../FirebaseConfig"
import { getUser, getBestExercise } from "../functions/databaseQueries"
import UserContext from "../contexts/UserContext";
import { NavigationProp } from "@react-navigation/native";
import { MyUser, BestExercise } from "../types and interfaces/types";
import { backgroundImage, globalStyles } from "../assets/styles";

interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
}

const Account = ({ route, navigation }: RouterProps) => {
  const loggedInUserID   = useContext(UserContext);
  const { userID } = route?.params;

  const [user, setUser] = useState<MyUser>({
    activityLevel: "",
    age: 0,
    experience: 0,
    gender: "",
    height: 0,
    level: 0,
    name: "",
    userID: "",
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
  const unsubscribeFromUser = getUser(userID, (userData: React.SetStateAction<MyUser>) => {
    setUser(userData);
  });
   const unsubscribeFromMostWeight = getBestExercise(userID, "weights", "reps", (exerciseData: BestExercise) => {    
    setmostWeightExercise(exerciseData);
  });
  const unsubscribeFromMostReps = getBestExercise(userID, "reps", "weights", (exerciseData: BestExercise) => {    
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
      weight: 0,
      userID: ""
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
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
    <View style={[globalStyles.container, {flex: 1}]}>
         <View>
              <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>{user.name}</Text>
              <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Level: {user.level}</Text>
              <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>XP until next level: {experienceNeeded}</Text>
              <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Best records</Text>
              {
                mostWeightExercise.name === ""
                ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                   Max weight: No data
                  </Text>
                : <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                    Max weight: {( mostWeightExercise).name} {( mostWeightExercise).weights} kg ({(mostWeightExercise).reps} repetitions)
                  </Text>
              }
              {
                mostRepsExercise.name === ""
                ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                   Most repetitions: No data
                  </Text>
                : <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                    Most repetitions: {( mostRepsExercise).name} {( mostRepsExercise).reps} repetitions ({( mostRepsExercise).weights} kg)
                  </Text>
              }
            </View>
      
          <Pressable style={globalStyles.button}>
              <Text style={globalStyles.buttonText} onPress={() => navigation.navigate("Achievements", {userID: userID})}>Achievements</Text>
          </Pressable>
        {userID === loggedInUserID &&
        <View>
          <Pressable style={globalStyles.button}>
              <Text style={globalStyles.buttonText} onPress={() => navigation.navigate("Edit profile", {user: user})}>Edit profile</Text>
          </Pressable>
          <Pressable style={globalStyles.button}>
              <Text style={globalStyles.buttonText} onPress={() => FIREBASE_AUTH.signOut()}>Log out</Text>
          </Pressable>
        </View>
        }
      </View>
    </ImageBackground>
  )
}

export default Account
