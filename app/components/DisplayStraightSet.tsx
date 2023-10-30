import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DisplayStraightSet = (props) => {
    const exercise = props.exercise;
    const handleDelete = props.handleDelete

    return (
   

    <View style={styles.container}>
    {exercise.exerciseName.length > 1
            ? <Text style={styles.exercise}>{exercise.exerciseName.length} sets of {exercise.exerciseName[0]}s</Text>
            : <Text style={styles.exercise}>{exercise.exerciseName.length} set of {exercise.exerciseName[0]}</Text>}     
    {exercise.reps !== undefined 
    ?   exercise.reps.length !== 0 
        ?   exercise.reps.map((rep, index) => 
            exercise.weights[index] === 0 && exercise.times[index] === 0
                ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, exercise.reps[index])}>
                        <Text style={styles.text} > Set {index + 1}: {rep} reps with no weight</Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </Pressable>
                :  exercise.weights[index] === 0
                ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.reps[index]* exercise.times[index]))}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.times[index]} seconds</Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </Pressable> 
                
                : exercise.times[index] === 0
                ? 
                    <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.reps[index]* exercise.weights[index]))}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weights[index]} kg</Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </Pressable>
                : 
                    <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.reps[index]* exercise.times[index] * exercise.weights[index]))}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weights[index]} kg for {exercise.times[index]} seconds </Text>
                        <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                    </Pressable>
            )
        : exercise.times.map((time, index) => 
            exercise.weights[index] === 0
            ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, exercise.times[index])}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                </Pressable>
            
            : 
                <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.weights[index]* exercise.times[index]))}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with {exercise.weights[index]} kg</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimes[index]/60} minutes</Text>
                </Pressable>
        )
    
    
    : 
        exercise.repsLeft.length !== 0 && exercise.repsRight.length !== 0
        ?   <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                    <Text style={styles.text}>Left side: </Text>
                    {exercise.repsLeft.map((rep, index) => 
                        exercise.weightsLeft[index] === 0 && exercise.timesLeft[index] === 0 && exercise.restTimesLeft[index] === 0
                        ? 
                         <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, exercise.repsLeft[index])}>
                            <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight</Text>
                        </Pressable>
                        :  exercise.weightsLeft[index] === 0 && exercise.timesLeft[index] === 0
                        ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, exercise.repsLeft[index])}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight</Text>
                                <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </Pressable>
                        : exercise.weightsLeft[index] === 0 && exercise.restTimesLeft[index] === 0
                        ? 
                        <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsLeft[index]* exercise.timesLeft[index]))}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesLeft[index]} seconds </Text>
                       </Pressable>
                        : exercise.weightsLeft[index] === 0
                        ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsLeft[index]* exercise.timesLeft[index]))}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with no weight for {exercise.timesLeft[index]} seconds</Text>
                                <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </Pressable>
                        : exercise.timesLeft[index] === 0 && exercise.restTimesLeft[index] === 0
                        ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsLeft[index]* exercise.weightsLeft[index]))}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weightsLeft[index]} kg</Text>
                            </Pressable>
                        : exercise.timesLeft[index] === 0
                        ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsLeft[index]* exercise.weightsLeft[index]))}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weightsLeft[index]} kg</Text>
                                <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </Pressable>
                        : exercise.restTimesLeft[index] === 0
                        ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsLeft[index]* exercise.weightsLeft[index] * exercise.timesLeft[index]))}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} reps with {exercise.weightsLeft[index]} kg for {exercise.timesLeft[index]} seconds </Text>
                            </Pressable>
                        :   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsLeft[index]* exercise.weightsLeft[index] * exercise.timesLeft[index]))}>
                                <Text style={styles.text} key={index}> Set {index + 1}: {rep} with {exercise.weightsLeft[index]} kg reps for {exercise.timesLeft[index]} seconds </Text>
                                <Text style={styles.text}>Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                            </Pressable> 
                    )}
                </View>
                <View style={styles.gridItem}>
                <Text style={styles.text}>Right side: </Text>
                {exercise.repsRight.map((rep, index) => 
                    exercise.weightsRight[index] === 0 && exercise.timesRight[index] === 0
                    ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, exercise.repsRight[index])}>
                            <Text style={styles.text} key={index}>{rep} reps with no weight</Text>
                            <Text style={styles.text}>Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </Pressable> 
                    : exercise.weightsRight[index] === 0
                    ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsRight[index]*exercise.timesRight[index]))}>
                            <Text style={styles.text} key={index}>{rep} reps with no weight for {exercise.timesRight[index]} seconds</Text>
                            <Text style={styles.text}>Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </Pressable>  
                    
                    : exercise.timesRight[index] === 0
                    ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsRight[index]*exercise.weightsRight[index]))}>
                            <Text style={styles.text} key={index}>{rep} reps with {exercise.weightsRight[index]} kg </Text>
                            <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </Pressable> 
                    :   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index, (exercise.repsRight[index]*exercise.weightsRight[index] * exercise.timesRight[index]))}>
                            <Text style={styles.text} key={index}>{rep} reps with {exercise.weightsRight[index]} kg for {exercise.timesRight[index]} seconds</Text>
                            <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                        </Pressable>  
                )}
                </View>
            </View>
        : <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
            <Text style={styles.text}>Left side: </Text>
            {exercise.timesLeft.map((time, index) => 
                exercise.weightsLeft[index] === 0 && exercise.restTimesLeft[index] === 0
                ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index,  exercise.timesLeft[index])}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with no weight</Text>
                    </Pressable>
                :  exercise.weightsLeft[index] === 0
                ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index,  exercise.timesLeft[index])}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with no weight</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                </Pressable>  
                : exercise.restTimesLeft[index] === 0
                ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index,  (exercise.timesLeft[index]*exercise.weightsLeft[index]))}>
                        <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with  reps with {exercise.weightsLeft[index]} kg </Text>
                     </Pressable>
                :   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index,  (exercise.timesLeft[index]*exercise.weightsLeft[index]))}>
                    <Text style={styles.text} key={index}> Set {index + 1}: {time} seconds hold with  reps with {exercise.weightsLeft[index]} kg </Text>
                    <Text style={styles.text}> Rest: {exercise.restTimesLeft[index]/60} minutes</Text>
                </Pressable>  
            )}
            </View>
            <View style={styles.gridItem}>
        <Text style={styles.text}>Right side: </Text>
        {exercise.timesRight.map((time, index) => 
            exercise.weightsRight[index] === 0
            ?   <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index,  exercise.timesRight[index])}>
                    <Text style={styles.text} key={index}>{time} seconds hold with no weight</Text>
                    <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
                </Pressable>  
            :  <Pressable key={index} style={styles.setContainer} onPress={() => alert("pressed")} onLongPress={() => handleDelete(exercise.exerciseName, index,  (exercise.timesRight[index]*exercise.weightsRight[index]))}>
                <Text style={styles.text} key={index}>{time} seconds hold with  reps with {exercise.weightsRight[index]} kg</Text>
            <Text style={styles.text}> Rest: {exercise.restTimesRight[index]/60} minutes</Text>
            </Pressable> 
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