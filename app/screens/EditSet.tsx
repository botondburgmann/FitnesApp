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

    const { exercise, setID, isIsometric} = route?.params; 
    const exerciseName = exercise.exerciseName[setID];   
    const [weight, setWeight] = useState<string>(exercise.weights[setID].toString())
    const [time, setTime] = useState<string>(exercise.times[setID].toString())
    const [reps, setReps] = isIsometric ? useState<string>("") : useState<string>(exercise.reps[setID].toString())
    const [restTime, setRestTime] = useState<string>(exercise.restTimes[setID].toString())

    const changeNormal = {
        weights : parseFloat(weight) ,
        reps :  parseFloat(reps),
        times :  parseFloat(time) ,
    }
    const changeIsometric = {
        weights : parseFloat(weight) ,
        times :  parseFloat(time) ,
    }

    function changeXP() {
        let currentExperience = 0;
        let toDelete = 1;
        let toAdd = 1
        for (const change in changeNormal) {
            if (exercise[change][setID] === 0) {
                exercise[change][setID] = 1
            }
            toDelete *=exercise[change][setID]
            if (Number.isNaN(changeNormal[change])) {
                toAdd *= exercise[change][setID];

            }
            else if (changeNormal[change] === 0) {
                toAdd *= 1;
            }
            else{
                toAdd *= changeNormal[change];
            }
        }

        currentExperience -=toDelete;
        currentExperience +=toAdd;
        return currentExperience
    }


    function handleModifyButton() {
        console.log(isIsometric);
        console.log(changeNormal.reps);
        if (isIsometric) {
            if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) {
                alert("Time field cannot be empty");
            }
            else{
                editSet(userID,exercise.exerciseName[setID],setID,changeIsometric, changeXP())
                navigation.navigate("Log")
            }
        } else {
            if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps)) {
                alert("Reps field cannot be empty"); 
            }
            else{
                editSet(userID,exercise.exerciseName[setID],setID,changeNormal, changeXP())
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