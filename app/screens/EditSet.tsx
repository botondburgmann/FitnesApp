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

    const { exercise, setID} = route?.params; 
    const exerciseName = exercise.exerciseName[setID];   
    const [weight, setWeight] = useState<string>(exercise.weights[setID].toString())
    const [time, setTime] = useState<string>(exercise.times[setID].toString())
    const [reps, setReps] = useState<string>(exercise.reps[setID].toString())
    const [restTime, setRestTime] = useState<string>(exercise.restTimes[setID].toString())

    const changes = {
        weights : parseFloat(weight) ,
        reps :  parseFloat(reps) ,
        times :  parseFloat(time) ,
    }

    function changeXP() {
        let currentExperience = 0;
        let toDelete = 1;
        let toAdd = 1
        for (const change in changes) {
            if (exercise[change][setID] === 0) {
                exercise[change][setID] = 1
            }
            toDelete *=exercise[change][setID]
            if (Number.isNaN(changes[change])) {
                changes[change] = exercise[change][setID];

            }
            else if (changes[change] === 0) {
                changes[change] = 1;

            }
            
            toAdd *= changes[change];
        }

        currentExperience -=toDelete;
        currentExperience +=toAdd;
        return currentExperience
    }


    function handleModifyButton() {
        editSet(userID,exercise.exerciseName[setID],setID,changes, changeXP())
        navigation.navigate("Log")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit set</Text>
            <Text>{exerciseName} {weight} {reps} {time} {restTime}</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            placeholder="Weight"
            autoCapitalize='none'
            onChangeText={(text) => setWeight(text)}
            />
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            placeholder="Reps"
            autoCapitalize='none'
            onChangeText={(text) => setReps(text)}
            />
            <TextInput
            keyboardType='numeric'
            style={styles.input}
            placeholder="Time (in seconds)"
            autoCapitalize='none'
            onChangeText={(text) => setTime(text)}
            />
            <TextInput
            keyboardType='numeric'
            style={styles.input}
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