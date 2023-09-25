import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

const Home: React.FC = () => {
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

  const [accountContainerStyle, setAccountContainerStyle] = useState(false);


  return (
    <View style={styles.container}>
      
      <View style={accountContainerStyle ? styles.accountContainerShown : styles.accountContainerHidden}>
        <Button  title="Profile Settings" />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log out" />
      </View>
      <View style={styles.navbar}><Button onPress={() => setAccountContainerStyle(!accountContainerStyle)} title="Account" /></View>
    </View>
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