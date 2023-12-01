import { ImageBackground, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { RouterProps, WeekRange } from '../../types and interfaces/types';
import WeekContext from '../../contexts/WeekContext';
import { workoutsStyles } from './styles';
import { getWorkoutDocs } from '../../functions/firebaseFunctions';
import { addTotalExperienceToFirebase, convertFieldsToNumeric, removeXP } from './workoutsFunction';
import { updateDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { SingleSet } from '../exercises/types';

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

    const change: SingleSet = {
        exercise: set.exercise,
        side: side,
        weight : parseFloat(weight) ,
        reps :  parseFloat(reps),
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

    function changeXP (isIsometric: boolean, change: SingleSet): number {
        let currentExperience = 0
        
        if (!isIsometric && change.reps !== undefined) {
            if (change.weight === 0 || Number.isNaN(change.weight))
                currentExperience += change.reps;
            else
                currentExperience += change.reps * change.weight;
            currentExperience += removeXP(set.reps, change.weight)
        }
        else {
            if (change.weight === 0 ||  Number.isNaN(change.weight))
                currentExperience += change.time;
            else
                currentExperience += change.time * change.weight;
            currentExperience += removeXP(set.time, change.weight)
            
        }       
        
        return currentExperience;
      }

    function modifySingleSet (): void {        
        if (userID === null){
            alert("User is not authorized");
            return;
        }
        if (date === null){
            alert("Date is not set");
            return;
        }
        if (week === null){
            alert("Week is not set");
            return
        }
        if (isIsometric && (change.time === 0 || Number.isNaN(change.time))){
            alert("Time field cannot be empty");
            return;
        } 
        if (!isIsometric && (change.reps === 0 || Number.isNaN(change.reps))){            
            alert("Reps field cannot be empty"); 
            return;
        }
        if (change.reps < 0){
            alert("Reps must be a positive number");
            return;
        }
        if (change.time < 0){
            alert("Time must be a positive number");
            return;
        }
        if (change.restTime < 0){
            alert("Rest time must be a positive number");
            return;
        }
        editSingleSet(userID, new Date(date), week, changeXP(isIsometric, change))
        navigation.navigate("Log")
    
    }


    async function editSingleSet (userID: string, date: Date, week: WeekRange, experience: number): Promise<void> {
        try {   
            const dataWithStrings = {
                exercise: set.exercise,
                reps: parseFloat(reps),
                restTime: parseFloat(restTime),
                side: side,
                time: parseFloat(time),
                weight: parseFloat(weight),
              }
              const numericData = convertFieldsToNumeric(dataWithStrings);                          
            const workoutDocs = await getWorkoutDocs(userID, date);
            if (workoutDocs === undefined){
                alert("Document doesn't exist");
                return;
            }        
            const updatedData = { ...workoutDocs.data() };
                  
            for (let i = 0; i < workoutDocs.data().Workout.length; i++) {   
                if(workoutDocs.data().Workout[i].exercise[setID] === set.exercise && i === exerciseID){
                    updatedData.Workout[i].weights[setID] = numericData.weight;
                    updatedData.Workout[i].repss[setID] = numericData.reps;
                    updatedData.Workout[i].times[setID] = numericData.time;
                    updatedData.Workout[i].restTimes[setID] = numericData.restTime;
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
                <Pressable style={[globalStyles.button, {width: 100}]} onPress={modifySingleSet}>
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