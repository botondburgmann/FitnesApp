import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

const Home: React.FC = () => {
  const [exercises, setExercises] = useState<string[]>([]);

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
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
{/*       {exercises.map((exercise, index) => (
        <Text key={index}>{exercise}</Text>
      ))} */}
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log out" />
    </View>
  );
};

export default Home;
