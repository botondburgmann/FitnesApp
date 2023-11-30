import { ImageBackground, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { ExerciseSet, RouterProps, WeekRange } from '../../types and interfaces/types';
import WeekContext from '../../contexts/WeekContext';
import { workoutsStyles } from './styles';
import { getWorkoutDocs } from '../../functions/firebaseFunctions';
import { addTotalExperienceToFirebase, removeXP } from './workoutsFunction';
import { updateDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

type RouteParamsTypes = {
    set: ExerciseSet;
    exerciseID: number;
    setID: number;
    isIsometric: boolean;
    date: Date;
}
const EditSet = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);
    const week = useContext(WeekContext);

    const { set, exerciseID, setID, isIsometric, date} = route?.params as RouteParamsTypes; 

    const [weight, setWeight] = useState(set.weight.toString());
    const [time, setTime] = useState(set.time.toString());
    const [reps, setReps] = isIsometric ? useState("") : useState(set.rep.toString());
    const [restTime, setRestTime] = useState((set.restTime/60).toString());
    const [isEnabled, setIsEnabled] = set.side === "left" ? useState(false) : useState(true);
    const [side, setSide] = useState(set.side);

    const change: ExerciseSet = {
        side: side,
        weight : parseFloat(weight) ,
        rep :  parseFloat(reps),
        time :  parseFloat(time) ,
        restTime : parseFloat(restTime)*60
    };

    function switchSides (): void {
        if (isEnabled)
            setSide('left');
        else
            setSide('right');
        setIsEnabled((previousState: boolean) => !previousState);
    }

    function changeXP (isIsometric: boolean, set: ExerciseSet): number {
        let currentExperience = 0
        if (!isIsometric && set.rep !== undefined) {
          if (set.weight === 0 && Number.isNaN(set.weight))
              currentExperience += set.rep;
          else
              currentExperience += set.rep * set.weight;
          currentExperience += removeXP(set.rep, set.weight)
        }
        else {
          if (set.weight === 0 && Number.isNaN(set.weight))
              currentExperience += set.time;
          else
              currentExperience += set.time * set.weight;
            currentExperience += removeXP(set.time, set.weight)
        }       
      
        return currentExperience;
      }

    function modifySet (): void {
        if (userID === null)
            throw new Error("User is not authorized");
        if (date === null)
            throw new Error("Date is not set");
        if (week === null)
            throw new Error("Week is not set");
        if (isIsometric && change.time === 0 || Number.isNaN(change.time)) 
            throw new Error("Time field cannot be empty");
        if (!isIsometric && change.rep === 0 || Number.isNaN(change.rep))
            throw new Error("Reps field cannot be empty"); 
        if (change.rep < 0)
            throw new Error("Reps must be a positive number")
        if (change.time < 0)
            throw new Error("Time must be a positive number")
        if (change.restTime < 0)
            throw new Error("Rest time must be a positive number")
        editSet(userID, date, week, changeXP(isIsometric, change))
        navigation.navigate("Log")
    
    }


    async function editSet (userID: string, date: Date, week: WeekRange, experience: number): Promise<void> {
        try {       
            const workoutDocs = await getWorkoutDocs(userID, date);
            if (workoutDocs === undefined) 
                throw new Error("Document doesn't exist");
                
            const updatedData = { ...workoutDocs.data() };
                  
            for (let i = 0; i < workoutDocs.data().Workout.length; i++) {   
                if(workoutDocs.data().Workout[i].exercise[setID] === set.exercise && i === exerciseID){
                    updatedData.Workout[i].weights[setID] = change.weight;
                    updatedData.Workout[i].reps[setID] = change.rep;
                    updatedData.Workout[i].times[setID] = change.time;
                    updatedData.Workout[i].restTimes[setID] = change.restTime;
                    updatedData.Workout[i].sides[setID] = change.side;
            
                    await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutDocs.id), {
                        Workout: updatedData.Workout
                    });
                }  
            }    
            addTotalExperienceToFirebase(experience, date, userID, week);   
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
                            onValueChange={switchSides}
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
                <Pressable style={[globalStyles.button, {width: 100}]} onPress={modifySet}>
                    <Text style={globalStyles.buttonText}>Modify</Text>
                </Pressable>
            </View>
        </ImageBackground>
    )
}

export default EditSet

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