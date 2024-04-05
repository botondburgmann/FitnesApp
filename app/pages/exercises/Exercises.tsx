import {  ActivityIndicator, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { Exercise, RouterProps } from '../../types and interfaces/types';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { Unsubscribe } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { getUserDocument } from '../../functions/firebaseFunctions';
import { ListItem, SearchBar } from "react-native-elements"; 


const Exercises = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');



  function getAllExercises (userID: string, callback: Function): Unsubscribe[] | undefined {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, "Users");
      const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
      const unsubscribeFunctions: Unsubscribe[] = [];
      const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
        if (usersSnapshot.empty) 
          throw new Error("User doesn't exist");

        const userDocRef = usersSnapshot.docs[0].ref;
        const exercisesCollectionRef = collection(userDocRef, "exercises");

        const unsubscribeFromExercises = onSnapshot(exercisesCollectionRef, exercisesSnapshot => {
          const exercises: Exercise[] = exercisesSnapshot.docs.map(exerciseDoc => ({
            hidden: exerciseDoc.data().hidden,
            isometric: exerciseDoc.data().isometric,
            label: exerciseDoc.data().name,
            value: exerciseDoc.data().value,
            musclesWorked: exerciseDoc.data().musclesWorked,
            unilateral: exerciseDoc.data().unilateral
          }));
      
          callback(exercises);
        });
                            
        unsubscribeFunctions.push(unsubscribeFromExercises);
      });

      unsubscribeFunctions.push(unsubscribeFromUsers);
      return unsubscribeFunctions;

    } catch (error: any) {
      alert(`Error: Couldn't fetch exercises: ${error}`);
    }
  }

  async function toggleExerciseVisibilty (userID: string, exerciseName: string): Promise<void> {
    try {
      const userDoc = await getUserDocument(userID)

      if (userDoc === undefined) 
        throw new Error("User doesn't exist");
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
  }

  useEffect(() => {
    if (userID === null) return;
     const unsubscribeFunctions = getAllExercises(userID, (receivedExercises: Exercise[]) => { 
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

  useEffect(() => {
    const filtered = exercises.filter((item: Exercise) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [search, exercises]);


  const exerciseComponentsList: React.JSX.Element[] = [];
  filteredExercises.forEach((exercise: { label: string; hidden: any; }, index: any) => {
    exerciseComponentsList.push(
      <View key={index} style={styles.row}>
        <Pressable style={{width: '50%'}} onPress={()=>navigation.navigate('Details', {exercise: exercise.label})}>
          <Text style={{
                    textAlign: 'left',
                    fontSize: 16,
                    color: "#fff",
                    opacity: exercise.hidden ? 0.5 : 1,
                    textTransform: 'uppercase',
                    fontWeight: "600",
                    paddingVertical: 10,
          }}>{exercise.label}</Text>
        </Pressable>
        <Pressable>
          {exercise.hidden 
            ? <Text style={styles.text} onPress={() => {userID !== null && toggleExerciseVisibilty(userID, exercise.label)}}>
                Unhide exercise
              </Text>
            : <Text style={styles.text} onPress={() => {userID !== null && toggleExerciseVisibilty(userID, exercise.label)}}>
                Hide exercise
              </Text>}
        </Pressable>
      </View>)
  })

    
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={styles.container}>
        <Text style={styles.label}>My exercises</Text>
        {loading
        ? <ActivityIndicator/>
        : <ScrollView>
            <TextInput
              style={styles.search}
              placeholder="Search for exercise..."
              onChangeText={(text: string) => setSearch(text)}
              value={search}
            />
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
  },
  search: {
    fontSize: 18,
    color: "#fff",
    textShadowOffset:{
        height: 2,
        width: 2
    },
    textShadowColor: "#000",
    textShadowRadius: 10,
    fontWeight: "600", 
    paddingVertical: 10,
    paddingLeft: 20
  }
});