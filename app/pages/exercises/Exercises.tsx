import {  ActivityIndicator, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import { Exercise, RouterProps } from '../../types and interfaces/types';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { Unsubscribe } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

const Exercises = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);


  function getAllExercises (userID: string | null, callback: Function): Unsubscribe[] | undefined {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const unsubscribeFunctions = [];
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDocRef = usersSnapshot.docs[0].ref;
                const exercisesCollectionRef = collection(userDocRef, "exercises");

                const unsubscribeFromExercises = onSnapshot(exercisesCollectionRef, exercisesSnapshot => {
                    const updatedExercises = exercisesSnapshot.docs.map(exerciseDoc => ({
                        hidden: exerciseDoc.data().hidden,
                        isometric: exerciseDoc.data().isometric,
                        name: exerciseDoc.data().name,
                        musclesWorked: exerciseDoc.data().musclesWorked,
                        unilateral: exerciseDoc.data().unilateral
                    }));
                
                    callback(updatedExercises);
                });
                

                
                unsubscribeFunctions.push(unsubscribeFromExercises);
                
            } else {
                throw new Error("User doesn't exist");
            }
        });

        unsubscribeFunctions.push(unsubscribeFromUsers);
        return unsubscribeFunctions;

    } catch (error: any) {
        alert(`Error: Couldn't fetch exercises: ${error}`);
    }
  };

  async function toggleExerciseVisibilty (userID: string | null, exerciseName: string): Promise<void> {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const userDoc = usersSnapshot.docs[0];

        const exercisesCollectionRef = collection(userDoc.ref, "exercises");
        const exercisesQuery = query(exercisesCollectionRef, where("name", "==", exerciseName));
        const exercisesSnapshot = await getDocs(exercisesQuery);
        exercisesSnapshot.docs.forEach((exercisesDoc) => {
            const updateData = {
                hidden: !exercisesDoc.data().hidden
            };
            
            updateDoc(exercisesDoc.ref, updateData);
        })

    } catch (error: any) {
        alert(`Error: Couldn't change visibility for ${exerciseName}: ${error.message}`)
    }
};

  useEffect(() => {
    const unsubscribeFunctions = getAllExercises(userID, (receivedExercises: React.SetStateAction<Exercise[]>) => {                    
        setExercises(receivedExercises);
        setLoading(false);
    });

    return () => {
      if (unsubscribeFunctions !== undefined) {
        unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
      }
        
        setExercises([]);
    };
}, [userID]);




  const exerciseComponentsList: React.JSX.Element[] = [];
  exercises.forEach((exercise, index) => {
    exerciseComponentsList.push(
      <View key={index} style={styles.row}>
        <Pressable style={{width: '50%'}} onPress={()=>navigation.navigate('Details', {exercise: exercise.name})}>
          <Text style={{
                    textAlign: 'left',
                    fontSize: 16,
                    color: "#fff",
                    opacity: exercise.hidden ? 0.5 : 1,
                    textTransform: 'uppercase',
                    fontWeight: "600",
                    paddingVertical: 10,
          }}>{exercise.name}</Text>
        </Pressable>
        <Pressable>
          {exercise.hidden 
            ? <Text style={styles.text} onPress={() => toggleExerciseVisibilty(userID, exercise.name)
            }>Unhide exercise</Text>
            : <Text style={styles.text} onPress={() => toggleExerciseVisibilty(userID, exercise.name)
            }>Hide exercise</Text>}
        </Pressable>
      </View>)
  })

    
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={styles.container}>
        <Text style={styles.label}>My exercises</Text>
        {loading
        ? <ActivityIndicator/>
        :  <ScrollView>
            { exerciseComponentsList}
          </ScrollView>
        }
      <Pressable style={styles.createExerciseButton} onPress={() => navigation.navigate("Create Exercise")}>
          <Text style={styles.createExerciseButtonText}>+</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default Exercises

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "rgba(128,128,128,0.5)",
    flex: 1, 
  },
  label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 40,
    textShadowOffset:{
        height: 2,
        width: 2
    },
    textShadowColor: "#000",
    textShadowRadius: 10,
    marginTop: 50, 
    marginBottom: 20
  },
  row : { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginHorizontal: 20, 
  },
  text:{
    alignSelf: "center",
    fontSize: 18,
    color: "#fff",
    textShadowOffset:{
        height: 2,
        width: 2
    },
    textShadowColor: "#000",
    textShadowRadius: 10,
    textTransform: "uppercase", 
    fontWeight: "600", 
    paddingVertical: 10,
  },
  createExerciseButton:{
    marginVertical: 20,
    alignSelf: 'flex-end',
    marginRight: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createExerciseButtonText:{
    fontSize: 25,
    color: "#fff",
    fontWeight: "600",
    alignSelf: 'center'
  }
});