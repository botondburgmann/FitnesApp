import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NormalSet from './NormalSet';
import IsometricSet from './IsometricSet';

interface Exercise {
    exerciseName: string[];
    reps: number[];
    weights: number[];
    times: number[];
    sides: string[];
    restTimes: number[];
};

const DisplaySet = (props) => {
    const exercise: Exercise  = props.exercise;
    const handleDelete: Function = props.handleDelete;
    const navigation = props.navigation;
    const exerciseID : number = props.exerciseID;

    
    const uniqueValues = {
        sides: Array.from(new Set<string>(exercise.sides)),
        exercise: Array.from(new Set<string>(exercise.exerciseName))
        
    };
    const unilateral : string = uniqueValues.sides.length === 2 ? "(per side)" : "";

    const numberOfSet = calculateNumberOfSets();


    function calculateNumberOfSets(): number {
        let numberOfSet = 0;
        for (const side of exercise.sides) {
            if (side === "both")
                numberOfSet++;
            else 
                numberOfSet +=0.5;
        }
        return isSuperSet ? numberOfSet/uniqueValues.exercise.length : numberOfSet;
    }

    function isDecreasing(array: any[]): boolean {
        for (let i = 1; i <= array.length; i++)
            if (array[i-1] < array[i] )
                return false;
        return true;
    }

    function isDropsSet(): boolean {
        for (let i = 0; i < exercise.restTimes.length-1; i++) 
            if (exercise.restTimes[i] > 0) 
                return false;
        if (!(uniqueValues.exercise.length === 1 && exercise.reps.length > 1 && isDecreasing(exercise.weights)))
            return false;
        return true;
    }

    function isSuperSet(): boolean {
        for (let i = 0; i < exercise.restTimes.length-1; i++) 
            if (exercise.restTimes[i] > 0) 
                return false;
        if (uniqueValues.exercise.length === 1)
            return false;
        return true;
    }
    
    return (
        <View style={styles.container}>
            {isSuperSet()
                ?   <View>
                        { numberOfSet === 1
                            ? <Text style={styles.exercise}>1 superset of</Text>
                            : <Text style={styles.exercise}>{numberOfSet} supersets</Text>
                        }     
                        <View style={styles.gridContainer}>
                            {uniqueValues.exercise.map((exercise,index) =>  
                            index !== uniqueValues.exercise.length-1
                                ? <Text style={styles.exercise} key={index}>{exercise} and </Text>
                                : <Text style={styles.exercise} key={index}>{exercise}</Text>
                            )}
                        </View>
                        { exercise.reps.length > 0 
                        ? <NormalSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"super"}/>
                        : <IsometricSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"super"}/>
                        }
                    </View>
            : isDropsSet()
                ?   <View>
                        <Text style={styles.exercise}>1 dropset of {uniqueValues.exercise} {unilateral}</Text>
                        { exercise.reps.length > 0 
                            ? <NormalSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"drop"}/>
                            : <IsometricSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"drop"}/>

                        }
                    </View>
            :   <View>
                    { numberOfSet === 1
                        ? <Text style={styles.exercise}>1 set of {uniqueValues.exercise[0]}</Text>
                        : <Text style={styles.exercise}>{numberOfSet} sets of {uniqueValues.exercise[0]}s {unilateral}</Text>
                    }
                    { exercise.reps.length > 0 
                    ? <NormalSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"straight"}/>
                    : <IsometricSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"straight"}/>
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
    gridContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 10,
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