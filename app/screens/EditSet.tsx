import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import { editSet } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { addXPForOneSet, removeXP } from '../functions/otherFunctions';


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
};

const EditSet = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);

    const { set, exerciseID, setID, isIsometric} = route?.params; 
    const [weight, setWeight] = useState<string>(set.weight.toString());
    const [time, setTime] = useState<string>(set.time.toString());
    const [reps, setReps] = isIsometric ? useState<string>("") : useState<string>(set.reps.toString());
    const [restTime, setRestTime] = useState<string>(set.restTime.toString());
    const [isEnabled, setIsEnabled] = set.side === "left" ? useState(false) : useState(true);
    const [side, setSide] = useState<string>(set.side);

    const changeNormal = {
        sides : side,
        weights : parseFloat(weight) ,
        reps :  parseFloat(reps),
        times :  parseFloat(time) ,
        restTimes : parseFloat(restTime)
    };
    const changeIsometric = {
        side: side,
        weights : parseFloat(weight) ,
        times :  parseFloat(time) ,
        restTimes : parseFloat(restTime)
    };

    function toggleSwitch(): void {
        if (isEnabled)
            setSide('left');
        else
            setSide('right');
        setIsEnabled(previousState => !previousState);
    }



    function handleModifyButton(isIsometric, changeIsometric, changeNormal, set): void {
        if (isIsometric) {
            if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) 
                alert("Time field cannot be empty");
            else{
                editSet(userID,set.exercise,exerciseID,setID,changeIsometric, (addXPForOneSet(isIsometric, changeIsometric)+removeXP(set.time, set.weight)))
                navigation.navigate("Log")
            }
        } else {
            if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps))
                alert("Reps field cannot be empty"); 
            else{
                editSet(userID,set.exercise, exerciseID, setID,changeNormal, (addXPForOneSet(isIsometric, changeNormal)+removeXP(set.reps, set.weight)))
                navigation.navigate("Log")
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit {set.exercise}</Text>
            { side !== "both"
                ?<View style={styles.gridContainer}>
                    <Text style={styles.text}>{side} side</Text>
                    <Switch
                        trackColor={{ false: "#808080", true: "#fff" }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                :<></>
            }
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
            </>
            :  <></>
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
            <Pressable style={styles.button} onPress={() => handleModifyButton(isIsometric, changeIsometric, changeNormal, set)}>
                <Text style={styles.text}>Modify</Text>                   
            </Pressable>
        </View>
    )
}

export default EditSet

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'center'
    },
    button:{
        width: 100,
        paddingHorizontal: 5,
        marginHorizontal: 20,
        alignSelf: "center",
        backgroundColor: "#000",
    },
    label: {
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        textTransform: 'uppercase',
        textAlign: 'center',
        marginVertical: 50
    },
  });