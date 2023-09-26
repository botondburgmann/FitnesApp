import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AddWorkout from './AddWorkout';

const Home: React.FC = () => {
  const Stack = createNativeStackNavigator();

  /* const [exercises, setExercises] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      let data: string[] = [];
      try {
        const exercisesCollection = collection(FIRESTORE_DB, 'Exercises');
        const q = query(exercisesCollection);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          data.push(docSnapshot.data().name); // Assuming 'name' is the property you want to display
        });
        setExercises(data);
      } catch (error: any) {
        alert('Fetching data has failed: ' + error.message);
      }
    };

    getData();
  }, []); */



  return (
      <Stack.Navigator initialRouteName='AddWorkout'>
        <Stack.Screen name='AddWorkout' component={ AddWorkout} options={{ headerShown: false }}/>
      </Stack.Navigator>
    

  );
};

export default Home;

const styles = StyleSheet.create({
  navbar:{
    
  },
  container:{
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end' 
  },
  accountContainerHidden:{
    display: 'none',
    height: '100%',
    width: '50%',
    backgroundColor: '#1E2D3E',
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-start', 
    paddingBottom: 30
  },
  accountContainerShown:{
    display: 'flex',
    height: '100%',
    width: '50%',
    backgroundColor: '#1E2D3E',
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-start', 
    paddingBottom: 30
  }
});