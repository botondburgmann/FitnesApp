import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NormalSet from './NormalSet';

const DisplaySet = (props) => {
    const exercise = props.exercise;
    const handleDelete = props.handleDelete;
    const navigation = props.navigation;
    const exerciseID = props.exerciseID;

    const uniqueValues = {
        sides: Array.from(new Set<string>(exercise.sides)),
        exercise: Array.from(new Set<string>(exercise.exerciseName))

    }

    const numberOfSet = exercise.reps.length > 0 
        ? exercise.reps.length/uniqueValues.sides.length/uniqueValues.exercise.length 
        : exercise.times.length/uniqueValues.sides.length/uniqueValues.exercise.length ;

    
    return (
   

    <View style={styles.container}>
        {
            exercise.restTimes.length <= numberOfSet && uniqueValues.exercise.length > 1 
            ? 
                <View>
                    <Text style={styles.exercise}>{numberOfSet} superset of</Text>
                    <View style={styles.gridContainer}>
                        {uniqueValues.exercise.map((exercise,index) =>
                        index !== uniqueValues.exercise.length-1
                            ? <Text style={styles.exercise} key={index}>{exercise} and </Text>
                            : <Text style={styles.exercise} key={index}>{exercise}</Text>
                        
                        )}
                    </View>
                    { exercise.reps.length > 0 
                    ? <NormalSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"super"}/>
                    : exercise.sides.includes("both")
                        ? exercise.times.map((time,index) => 
                            <View key={index}>
                                <Text>Set {index + 1}</Text>
                                <Pressable
                                    style={styles.setContainer} 
                                    onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: false})} 
                                    onLongPress={() => alert("delete")}                                
                                >
                                    <Text>{time} second hold of {exercise.exerciseName[index]} with {exercise.weights[index]} kg</Text>
                                </Pressable>
                            </View>
                        )
                        : exercise.reps.map((time,index) => 
                            <View key={index}>
                                <Text>Sets {index + 1}</Text>
                                <Pressable
                                    style={styles.setContainer} 
                                    onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: true})} 
                                    onLongPress={() => alert("delete")}
                                >
                                    <Text>{time} second hold of {exercise.exerciseName[index]} on the {exercise.sides[index]} with {exercise.weights[index]} kg</Text>
                                </Pressable>
                            </View>   
                        )
                    }
                </View>
            : exercise.restTimes.length < numberOfSet && uniqueValues.exercise.length == 1
            ? 
                <View>
                    <Text>1 dropset of {uniqueValues.exercise}</Text>
                    { exercise.reps.length > 0 
                        ? exercise.sides.includes("both")
                            ? exercise.reps.map((rep,index) => 
                            <View key={index}>
                                <Pressable 
                                    style={styles.setContainer} 
                                    onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: false})} 
                                    onLongPress={() => alert("delete")}
                                >                                    
                                    <Text>{rep} reps of {exercise.exerciseName[index]} with {exercise.weights[index]} kg</Text>
                                </Pressable>
                            </View>
                            )
                            : exercise.reps.map((rep,index) => 
                            <View key={index}>
                                <Text>Sets {index + 1}</Text>
                                <Pressable
                                    style={styles.setContainer} 
                                    onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: true})} 
                                    onLongPress={() => alert("delete")}                                
                                >
                                    <Text>{rep} reps of {exercise.exerciseName[index]} on the {exercise.sides[index]} with {exercise.weights[index]} kg</Text>
                                </Pressable>
                            </View>
                            )
                        : exercise.sides.includes("both")
                            ? exercise.times.map((time,index) => 
                                <View key={index}>
                                    <Pressable
                                        style={styles.setContainer} 
                                        onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: false})} 
                                        onLongPress={() => alert("delete")}                                
                                    >
                                        <Text>{time} second hold of {exercise.exerciseName[index]} with {exercise.weights[index]} kg</Text>
                                    </Pressable>
                                </View>
                            )
                            : exercise.reps.map((time,index) => 
                                <View key={index}>
                                    <Text>Sets {index + 1}</Text>
                                    <Pressable
                                        style={styles.setContainer} 
                                        onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: true})} 
                                        onLongPress={() => alert("delete")}
                                    >
                                        <Text>{time} second hold of {exercise.exerciseName[index]} on the {exercise.sides[index]} with {exercise.weights[index]} kg</Text>
                                    </Pressable>
                                </View>   
                            )
                    }
                </View>
            : 
            <View>
            <Text style={styles.exercise}>{numberOfSet} set of {uniqueValues.exercise[0]}</Text>
            { exercise.reps.length > 0 
            ? <NormalSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"straight"}/>
            : exercise.sides.includes("both")
                ? exercise.times.map((time,index) => 
                    <View key={index}>
                        <Text>Set {index + 1}</Text>
                        <Pressable
                            style={styles.setContainer} 
                            onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: false})} 
                            onLongPress={() => alert("delete")}                                
                        >
                            <Text>{time} second hold of {exercise.exerciseName[index]} with {exercise.weights[index]} kg</Text>
                        </Pressable>
                    </View>
                )
                : exercise.reps.map((time,index) => 
                    <View key={index}>
                        <Text>Sets {index + 1}</Text>
                        <Pressable
                            style={styles.setContainer} 
                            onPress={() => navigation.navigate("Edit bilateral set",{exercise: exercise, exerciseID: exerciseID,  setID: index, isIsometric: true})} 
                            onLongPress={() => alert("delete")}
                        >
                            <Text>{time} second hold of {exercise.exerciseName[index]} on the {exercise.sides[index]} with {exercise.weights[index]} kg</Text>
                        </Pressable>
                    </View>   
                )
            }
        </View>
        }



    </View>    
    )

}

export default DisplaySet

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
        textAlign: 'center'
    }
})