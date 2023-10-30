import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { deleteExercise } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';

const DisplayStraightSet = (props) => {
    const userID = useContext(UserContext);

    const exercise = props.exercise;

    return (
   

    <View style={styles.container}>
    {exercise.exerciseName.length > 1
            ? <Text style={styles.exercise}>{exercise.exerciseName.length} sets of {exercise.exerciseName[0]}s</Text>
            : <Text style={styles.exercise}>{exercise.exerciseName.length} set of {exercise.exerciseName[0]}</Text>}     
    {exercise.reps !== undefined 
    ?   exercise.reps.length !== 0 
        ?   exercise.reps.map((rep, index) => 
            exercise.weights[index] === undefined && exercise.times[index] === undefined
                ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => alert("long pressed")}>
                        <Text style={styles.text} > Set {index + 1}: {rep} reps with no weight</Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </Pressable>
                :  exercise.weights[index] === undefined 
                ?   <View key={index} style={styles.setContainer}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.times[index]} seconds</Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </View> 
                
                : exercise.times[index] === undefined 
                ? 
                    <View key={index} style={styles.setContainer}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weights[index]} kg</Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </View>
                : 
                    <View key={index} style={styles.setContainer}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weights[index]} kg for {exercise.times[index]} seconds </Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </View>
            )
        : exercise.times.map((time, index) => 
            exercise.weights[index] === undefined
            ?   <View key={index} style={styles.setContainer}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                </View>
            
            : 
                <View key={index} style={styles.setContainer}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with {exercise.weights[index]} kg</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                </View>
        )
    
    
    : 
        exercise.repsLeft.length !== 0 && exercise.repsRight.length !== 0
        ?   <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                    <Text style={styles.text}>Left side: </Text>
                    {exercise.repsLeft.map((rep, index) => 
                        exercise.weightsLeft[index] === undefined && exercise.timesLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
                        ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight</Text>
                        :  exercise.weightsLeft[index] === undefined && exercise.timesLeft[index] === undefined
                        ?   <View key={index} style={[styles.setContainer, styles.gridItem]}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight</Text>
                                <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </View>
                        : exercise.weightsLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
                        ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesLeft[index]} seconds </Text>
                        : exercise.weightsLeft[index] === undefined
                        ?  <View key={index} style={[styles.setContainer, styles.gridItem]}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesLeft[index]} seconds</Text>
                                <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </View>
                        : exercise.timesLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
                        ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weightsLeft[index]} kg</Text>
                        : exercise.timesLeft[index] === undefined
                        ?   <View key={index} style={[styles.setContainer, styles.gridItem]}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weightsLeft[index]} kg</Text>
                                <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </View>
                        : exercise.restTimesLeft[index] === undefined
                        ? <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weightsLeft[index]} kg for {exercise.timesLeft[index]} seconds </Text>
                        :  <View key={index} style={[styles.setContainer, styles.gridItem]}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} with {exercise.weightsLeft[index]} kg reps for {exercise.timesLeft[index]} seconds </Text>
                                <Text style={styles.text}>Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </View> 
                    )}
                </View>
                <View style={styles.gridItem}>
                <Text style={styles.text}>Right side: </Text>
                {exercise.repsRight.map((rep, index) => 
                    exercise.weightsRight[index] === undefined && exercise.timesRight[index] === undefined
                    ?   <View key={index} style={styles.setContainer}>
                            <Text style={styles.text} key={index}>{rep} reps with no weight</Text>
                            <Text style={styles.text}>Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </View> 
                    : exercise.weightsRight[index] === undefined
                    ?   <View key={index} style={styles.setContainer}>
                            <Text style={styles.text} key={index}>{rep} reps with no weight for {exercise.timesRight[index]} seconds</Text>
                            <Text style={styles.text}>Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </View>  
                    
                    : exercise.timesRight[index] === undefined
                    ?   <View key={index} style={styles.setContainer}>
                            <Text style={styles.text} key={index}>{rep} reps with {exercise.weightsRight[index]} kg </Text>
                            <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </View> 
                    :   <View key={index} style={styles.setContainer}>
                            <Text style={styles.text} key={index}>{rep} reps with {exercise.weightsRight[index]} kg for {exercise.timesRight[index]} seconds</Text>
                            <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </View>  
                )}
                </View>
            </View>
        : <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
            <Text style={styles.text}>Left side: </Text>
            {exercise.timesLeft.map((time, index) => 
                exercise.weightsLeft[index] === undefined && exercise.restTimesLeft[index] === undefined
                ? <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with no weight</Text>
                :  exercise.weightsLeft[index] === undefined
                ? <View key={index} style={styles.setContainer}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with no weight</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                </View>  
                : exercise.restTimesLeft[index] === undefined
                ? <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with  reps with {exercise.weightsLeft[index]} kg </Text>
                : <View key={index} style={styles.setContainer}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with  reps with {exercise.weightsLeft[index]} kg </Text>
                    <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                </View>  
            )}
            </View>
            <View style={styles.gridItem}>
        <Text style={styles.text}>Right side: </Text>
        {exercise.timesRight.map((time, index) => 
            exercise.weightsRight[index] === undefined
            ?   <View key={index} style={styles.setContainer}>
                    <Text style={styles.text} key={index}>{time} seconds hold with no weight</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                </View>  
            : <View key={index} style={styles.setContainer}>
            <Text style={styles.text} key={index}>{time} seconds hold with  reps with {exercise.weightsRight[index]} kg</Text>
            <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
            </View> 
        )}
            </View>
        </View>
    }    
    </View>    
    )

}

export default DisplayStraightSet

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 5
      },
      setContainer: {
        alignItems: 'center',
        marginVertical: 5
      },
      gridContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 10,
        marginVertical: 20

      },
      gridItem:{
        width: '50%',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
    text: {
        fontSize: 16,
        lineHeight: 25,
        letterSpacing: 0.25,
        color: 'white',
    },
    exercise: {
        fontSize: 20,
        lineHeight: 50,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    }
})