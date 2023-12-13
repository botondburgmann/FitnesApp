import { ImageBackground, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { RouterProps, SingleSet } from '../../types and interfaces/types';
import WeekContext from '../../contexts/WeekContext';
import { workoutsStyles } from './styles';
import { getWorkoutDocs } from '../../functions/firebaseFunctions';
import { addTotalExperienceToFirebase, addXP, removeXP, validateData } from './workoutsFunction';
import { updateDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

type RouteParamsTypes = {
    set: SingleSet;
    exerciseID: number;
    setID: number;
    isIsometric: boolean;
    date: string;
}
const EditSingleSet = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);
    const week = useContext(WeekContext);

    const { set, exerciseID, setID, isIsometric, date} = route?.params as RouteParamsTypes; 
    
    const [weight, setWeight] = useState(set.weight.toString());
    const [time, setTime] = useState(set.time.toString());
    const [reps, setReps] = isIsometric ? useState("") : useState(set.reps.toString());
    const [restTime, setRestTime] = useState((set.restTime/60).toString());
    const [isEnabled, setIsEnabled] = set.side === "left" ? useState(false) : useState(true);
    const [side, setSide] = useState(set.side);



    function toggleSwitch(): void {
        try {
          if (isEnabled) setSide('left');
          else setSide('right');
          
          setIsEnabled(previousState => !previousState);
        } catch (error: any) {
          alert(`Error: Couldn't toggle switch: ${error}`)
        }
    };

    async function editSet (weight: string, reps: string, time: string, restTime: string, side: string): Promise<void> {
        try {   
            if (userID === null) 
                throw new Error("Error: User not authorized");
            if (date === null)
                throw new Error("Date is not set");
            if (week === null)
                throw new Error("Week is not set");

            const numericData = {
                exercise: set.exercise,
                reps: parseFloat(reps) || 0,
                restTime: parseFloat(restTime)*60 || 0,
                side: side as "both" | "left" | "right",
                time: parseFloat(time) || 0,
                weight: parseFloat(weight) || 0,
              }
              validateData(isIsometric, numericData.reps, numericData.time, numericData.restTime);      

            const workoutDocs = await getWorkoutDocs(userID, new Date(date));
            if (workoutDocs === undefined) throw new Error("Document doesn't exist");      
            
            const updatedData = { ...workoutDocs.data() };
                  
            for (let i = 0; i < workoutDocs.data().Workout.length; i++) {   
                if(workoutDocs.data().Workout[i].exercise[setID] === set.exercise && i === exerciseID){
                    updatedData.Workout[i].weights[setID] = numericData.weight;
                    updatedData.Workout[i].reps[setID] = numericData.reps;
                    updatedData.Workout[i].times[setID] = numericData.time;
                    updatedData.Workout[i].restTimes[setID] = numericData.restTime;
                    updatedData.Workout[i].sides[setID] = numericData.side; 

                    await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutDocs.id), {
                        Workout: updatedData.Workout
                    });
                }  
            }    
            let experience = addXP(isIsometric, numericData)+removeXP(isIsometric ? set.time : set.reps, set.weight);
            addTotalExperienceToFirebase(experience, new Date(date), userID, week);   
            navigation.navigate("Log")
        } catch (error: any) {
            alert(`Error: couldn't update set fields: ${error.message}`);
       }
    };
    
    return (
        <ImageBackground source={backgroundImage} style={globalStyles.image}>
        <View style={[globalStyles.container, {flex: 1}]}>
                <Text style={workoutsStyles.label}>Edit {set.exercise}</Text>
                { side !== "both"
                    ?<View style={styles.gridContainer}>
                        <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>{side} side</Text>
                        <Switch
                            trackColor={{ false: "#808080", true: "#fff" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    :<></>
                }
                <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>weight (kg)</Text>
                <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={weight}
                    placeholder="Weight"
                    autoCapitalize='none'
                    onChangeText={(text: string) => setWeight(text)}
                />
                {!isIsometric
                ? <>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>reps</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={globalStyles.input}
                        value={reps}
                        placeholder="Reps"
                        autoCapitalize='none'
                        onChangeText={(text: string) => setReps(text)}
                    />
                </>
                :  <></>
                }
            
                <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>time (seconds)</Text>
                <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={time}
                    placeholder="Time (in seconds)"
                    autoCapitalize='none'
                    onChangeText={(text: string) => setTime(text)}
                />
                <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>Rest time (minutes)</Text>
                <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={restTime}
                    placeholder="Rest time (in minutes)"
                    autoCapitalize='none'
                    onChangeText={(text: string) => setRestTime(text)}
                />
                <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => editSet(weight, reps, time, restTime, side)}>
                    <Text style={globalStyles.buttonText}>Modify</Text>
                </Pressable>
            </View>
        </ImageBackground>
    )
}

export default EditSingleSet

const styles = StyleSheet.create({
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
    label: {
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        textTransform: 'uppercase',
        textAlign: 'center',
        marginVertical: 50
    },
  });