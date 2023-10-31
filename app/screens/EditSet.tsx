import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import { editSet } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

interface RouterProps {
    route: any,
    navigation: NavigationProp<any, any>;
}



const EditBilateralSet = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);

    const { exercise, exerciseID, setID, isIsometric} = route?.params; 
    const exerciseName = exercise.exerciseName[setID];   
    const [weight, setWeight] = useState<string>(exercise.weights[setID].toString())
    const [time, setTime] = useState<string>(exercise.times[setID].toString())
    const [reps, setReps] = isIsometric ? useState<string>("") : useState<string>(exercise.reps[setID].toString())
    const [restTime, setRestTime] = useState<string>(exercise.restTimes[setID].toString())

    console.log(`rest: ${restTime}`);
    

    const changeNormal = {
        weights : parseFloat(weight) ,
        reps :  parseFloat(reps),
        times :  parseFloat(time) ,
        restTimes : parseFloat(restTime)
    }
    const changeIsometric = {
        weights : parseFloat(weight) ,
        times :  parseFloat(time) ,
        restTimes : parseFloat(restTime)
    }

    function addXP() {
        let currentExperience = 0;
        if (!isIsometric) {
            if (changeNormal.weights === 0 && Number.isNaN(changeNormal.weights)) {
                currentExperience += changeNormal.reps
            }
            else {
                currentExperience += changeNormal.reps * changeNormal.weights
            }
        }
        else {
            if (changeNormal.weights === 0 && Number.isNaN(changeNormal.weights)) {
                currentExperience += changeNormal.times
            }
            else {
                currentExperience += changeNormal.times * changeNormal.weights
            }
        }
        console.log(currentExperience);
        
        return currentExperience
    }
    function removeXP() {
        let currentExperience = 0;
        if (!isIsometric) {
            if (exercise.weights[setID] === 0 && Number.isNaN(exercise.weights[setID])) {
                currentExperience -= exercise.reps[setID]
            }
            else {
                currentExperience -= exercise.reps[setID] * exercise.weights[setID]
            }
        }
        else {
            if (changeNormal.weights === 0 && Number.isNaN(changeNormal.weights)) {
                currentExperience -= exercise.times[setID];
            }
            else {
                currentExperience -= exercise.times[setID] * exercise.weights[setID];
            }
        }
        console.log(currentExperience);

        return currentExperience
    }

    function handleModifyButton() {
        if (isIsometric) {
            if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) {
                alert("Time field cannot be empty");
            }
            else{
                editSet(userID,exercise.exerciseName[setID],exerciseID,setID,changeIsometric, (addXP()+removeXP()))
                navigation.navigate("Log")
            }
        } else {
            if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps)) {
                alert("Reps field cannot be empty"); 
            }
            else{
                editSet(userID,exercise.exerciseName[setID], exerciseID, setID,changeNormal, (addXP()-removeXP()))
                navigation.navigate("Log")
            }
        }

    
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit {exerciseName}</Text>
            <Text style={styles.text}>weight (kg)</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={weight}
            placeholder="Weight"
            autoCapitalize='none'
            onChangeText={(text) => setWeight(text)}
            />
            {!isIsometric 
            
            ? <>
             <Text style={styles.text}>reps</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={reps}
            placeholder="Reps"
            autoCapitalize='none'
            onChangeText={(text) => setReps(text)}
            />
            </>:
            <></>
        }
           
            <Text style={styles.text}>time (seconds)</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={time}
            placeholder="Time (in seconds)"
            autoCapitalize='none'
            onChangeText={(text) => setTime(text)}
            />
            <Text style={styles.text}>Rest time (seconds)</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={restTime}
            placeholder="Rest time (in seconds)"
            autoCapitalize='none'
            onChangeText={(text) => setRestTime(text)}
            />
            <Pressable style={styles.button} onPress={() => handleModifyButton()}>
                <Text style={styles.text}>Modify</Text>                   
            </Pressable>
        </View>
    )
}

export default EditBilateralSet

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