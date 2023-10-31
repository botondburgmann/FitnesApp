import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NormalSet from './NormalSet';
import IsometricSet from './IsometricSet';

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

    
    function isDecreasing(array: any[]) {
        for (let i = 1; i <= array.length; i++)
            if (array[i-1] < array[i] )
                return false
        return true;
    }

    function isDropsSet(): boolean {
        for (let i = 0; i < exercise.restTimes.length-1; i++) 
            if (exercise.restTimes[i] > 0) 
                return false
        if (!(uniqueValues.exercise.length === 1 && exercise.reps.length > 1 && isDecreasing(exercise.weights)))
            return false
        return true;

    }

    function isSuperSet(): boolean {
        for (let i = 0; i < exercise.restTimes.length-1; i++) 
            if (exercise.restTimes[i] > 0) 
                return false
        if (uniqueValues.exercise.length === 1)
            return false
        return true;
    }
    
    return (
   

    <View style={styles.container}>
        {
            isSuperSet()
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
                    : <IsometricSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"super"}/>
                    }
                </View>
            : isDropsSet()
            ? 
                <View>
                    <Text style={styles.exercise}>1 dropset of {uniqueValues.exercise}</Text>
                    { exercise.reps.length > 0 
                        ? <NormalSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"drop"}/>
                        : <IsometricSet exercise={exercise} handleDelete={handleDelete} navigation={navigation} exerciseID={exerciseID} typeOfSet={"drop"}/>

                    }
                </View>
            : 
            <View>
            { numberOfSet === 1
                ? <Text style={styles.exercise}>1 set of {uniqueValues.exercise[0]}</Text>
                : <Text style={styles.exercise}>{numberOfSet} sets of {uniqueValues.exercise[0]}</Text>
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
      setContainer: {
        alignItems: 'center',
        marginVertical: 5
      },
      gridContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 10,

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