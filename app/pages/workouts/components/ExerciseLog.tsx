import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import UserContext from '../../../contexts/UserContext';
import {  Outputs, WeekRange } from '../../../types and interfaces/types';
import { globalStyles } from '../../../assets/styles';
import NavigationContext from '../../../contexts/NavigationContext';
import WeekContext from '../../../contexts/WeekContext';
import DateContext from '../../../contexts/DateContext';
import { getWorkoutDocs } from '../../../functions/firebaseFunctions';
import { addTotalExperienceToFirebase, isDropsSet, isSuperSet, removeXP } from '../workoutsFunction';
import {  ExerciseLogType } from '../types';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../../FirebaseConfig';

const ExerciseLog = (props: { exercise: ExerciseLogType; exerciseID: number; }) => {

    const userID = useContext(UserContext);
    const navigation = useContext(NavigationContext);
    const week = useContext(WeekContext);
    const date = useContext(DateContext);

    const exercise= props.exercise;
    const exerciseID = props.exerciseID;

    const uniqueValues = {
        sides: Array.from(new Set<string>(exercise.sides)),
        exercise: Array.from(new Set<string>(exercise.exercise)),
        
    };
    function calculateNumberOfSets (sides: string[], uniqueExerciseLength: number, restTimes: number[]): number | undefined {
        try {
          let numberOfSet = 0;
          for (const side of sides) {
              if (side === "both")
                  numberOfSet++;
              else 
                  numberOfSet +=0.5;
          }
          return isSuperSet(exercise, uniqueValues.exercise) ? numberOfSet/uniqueExerciseLength : numberOfSet;
        } catch (error) {
          alert(`Error: Couldn't calculate number of sets: ${error}`)
        }
    };

    const numberOfSets = calculateNumberOfSets(exercise.sides, uniqueValues.exercise.length, exercise.restTimes);
    const unilateral = uniqueValues.sides.length === 2 ? "(per side)" : "";

    const outputs: Outputs = {
        setNumbers: [],
        reps : [],
        seconds: [],
        weights: [],
        names: [],
        sides: []
    };
    
    

    for (let i = 0; i < exercise.sides.length; i++) {
        if (isDropsSet(exercise, uniqueValues.exercise) || (isSuperSet(exercise, uniqueValues.exercise) && exercise.exercise[i] !== exercise.exercise[0]) && exercise.sides[i] !== "both")
            outputs.setNumbers.push("");
        else if (exercise.sides[i] === "both")
            outputs.setNumbers.push(`Set ${i+1}`);
        else if(exercise.sides[i] !== "both" && i % 2 === 0)
            i === 0 ? outputs.setNumbers.push(`Set ${i+1}`) : outputs.setNumbers.push(`Set ${i}`);
        else
            outputs.setNumbers.push("");
        if (!(isDropsSet(exercise, uniqueValues.exercise) ||isSuperSet(exercise, uniqueValues.exercise) ) || isDropsSet(exercise, uniqueValues.exercise))
            outputs.names.push("")
        else
            outputs.names.push(` of ${exercise.exercise[i]}`);
        if (exercise.sides[i] === "both") 
            outputs.sides.push("") 
        else
            outputs.sides.push(`on the ${exercise.sides[i]} side`); 
        if (exercise.reps[i] === 1) 
            outputs.reps.push("1 rep") 
        else    
            outputs.reps.push(`${exercise.reps[i]} reps`);    
        if (exercise.times[i] === 1) 
            outputs.seconds.push('for 1 second') 
        else if (exercise.times[i] > 1) 
            outputs.seconds.push(`for ${ exercise.times[i]} seconds`)        
        if (exercise.times[i] === 1) 
            outputs.seconds.push('1 second hold') 
        else if (exercise.times[i] > 1) 
            outputs.seconds.push(`${ exercise.times[i]} seconds hold`)
        else
        outputs.seconds.push("");
    if (exercise.weights[i] == 0)
            outputs.weights.push(`with no weight`)
        else if (exercise.weights[i] < 0)
            outputs.weights.push(`with ${-exercise.weights[i]} kg assisted`)
        else
        outputs.weights.push(`with ${exercise.weights[i]} kg`);
    }
    function handleLongPress(index:number) {
        try {
            if (userID === null)
                throw new Error("User is Not authorized")
            if (date === null)
                throw new Error("Date is not set");
            if (week === null) 
                throw new Error("Week is not set");
            if (exercise.isometric)
                showDeleteConfirmation(userID, date, week, index, removeXP(exercise.times[index],exercise.weights[index]))
            else
                showDeleteConfirmation(userID, date, week, index, removeXP(exercise.reps[index],exercise.weights[index]))
            
        } catch (error: any) {
            alert(`Error showing confirmation message: ${error}`)
        }
    }
    function showDeleteConfirmation(userID: string, date: Date, week: WeekRange, setIndex: number, xpDelete: number): void{
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [{
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => { deleteSet(userID, date, week, setIndex, xpDelete)}
            }],
            { cancelable: false }
          );
    };
    async function deleteSet (userID:string, date:Date, week: WeekRange, setIndex: number, xpToDelete: number): Promise<void> {
        try { 
            if (week === null) 
                throw new Error("Week is not set");
                 
            const workoutDocs = await getWorkoutDocs(userID,date);
                  
            if (workoutDocs === undefined)
                throw new Error("Couldn't find workout");
             const updatedData = { ...workoutDocs.data() };
    
            for (let i = 0; i < workoutDocs.data().Workout.length; i++) {  
                                 
                if (workoutDocs.data().Workout[i].exercise[setIndex] === exercise.exercise[0] && i === exerciseID){
                
                updatedData.Workout[i].exercise.splice(setIndex, 1);
                updatedData.Workout[i].weights.splice(setIndex, 1);
                updatedData.Workout[i].reps.splice(setIndex, 1);
                updatedData.Workout[i].times.splice(setIndex, 1);
                updatedData.Workout[i].sides.splice(setIndex, 1);
                updatedData.Workout[i].restTimes.splice(setIndex, 1); 
                if (updatedData.Workout[i].exercise.length === 0) { 
                    updatedData.Workout.splice(i,1)
                }
                  
                await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutDocs.id), {
                    Workout: updatedData.Workout
                });
                if ( updatedData.Workout.length === 0){

                    await deleteDoc(workoutDocs.ref);
                }
                }
      
            } 
          
        addTotalExperienceToFirebase(xpToDelete,date,userID,week);
    
        } 
        catch (error: any) {
            alert(`Error: Couldn't delete fields: ${error.message}`);
       }
    };
    
    const sets: React.JSX.Element[] = [];
    outputs.seconds.map((second,index) => 
        sets.push(
        <View key={index} style={styles.container} >
            {
                outputs.setNumbers[index] !== ""
                    ? <Text style={[globalStyles.text, {lineHeight: 35}]}>{outputs.setNumbers[index]}</Text>
                    : <></>
            }
            <Pressable
                onPress={() => {navigation && navigation.navigate("Edit set",{set: {exercise : exercise.exercise[index],
                    rep: exercise.reps[index],
                    restTime: exercise.restTimes[index],
                    side: exercise.sides[index],
                    time: exercise.times[index],
                    weight: exercise.weights[index],
                    }, exerciseID: exerciseID, setID: index, isIsometric: exercise.isometric})}} 
                onLongPress={() => handleLongPress(index)}                                
            >
                <Text style={[globalStyles.text, {lineHeight: 35}]}>{second}{outputs.names[index]}{outputs.reps[index]}{outputs.sides[index]} {outputs.seconds[index]}{outputs.weights[index]}</Text>
                { exercise.restTimes[index] > 0
                    ? <Text style={[globalStyles.text, {lineHeight: 35}]}>{exercise.restTimes[index]/60} minute rest</Text>
                    : <></>
                }                            
            </Pressable>
        </View>)
    )



    return (
        <View>
           { isSuperSet(exercise, uniqueValues.exercise) 
           ? <View>
                { numberOfSets === 1
                    ? <Text style={globalStyles.exerciseName}>1 superset of</Text>
                    : <Text style={globalStyles.exerciseName}>{numberOfSets} supersets</Text>
                }     
                <View>
                    {uniqueValues.exercise.map((exercise,index) =>  
                    index !== uniqueValues.exercise.length-1
                        ? <Text style={globalStyles.exerciseName} key={index}>{exercise} and </Text>
                        : <Text style={globalStyles.exerciseName} key={index}>{exercise}</Text>
                    )}
                </View>
                {sets}
           </View>
            : isDropsSet(exercise, uniqueValues.exercise) 
            ?
                <View>
                    <Text style={globalStyles.exerciseName}>1 dropset of {uniqueValues.exercise} {unilateral}</Text>
                    {sets}       
                </View>
            :
            <View>
                { numberOfSets === 1
                    ? <Text style={globalStyles.exerciseName}>1 set of {uniqueValues.exercise[0]}</Text>
                    : uniqueValues.exercise[0][uniqueValues.exercise[0].length-1] === "s" 
                    ? <Text style={globalStyles.exerciseName}>{numberOfSets} sets of {uniqueValues.exercise[0]}es {unilateral}</Text>
                    : <Text style={globalStyles.exerciseName}>{numberOfSets} sets of {uniqueValues.exercise[0]}s {unilateral}</Text>
                }
                {sets}                
            </View>}


        </View>
    )
}

export default ExerciseLog


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 5
      },
})