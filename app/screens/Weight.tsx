import { View, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const Weight = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [weight, setWeight] = useState('');
  const {userID} = route.params as RouteParams;

  const handleData =async (weight) => {
    try {
      if (weight === '')
        throw new Error("Weight must be set");

      // Set the weight field's value of the current's user's document     
      const usersCollection = collection(FIRESTORE_DB, 'users');
      const q = query(usersCollection, where("userID", '==',userID));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnapshot) => {
        const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);
        const newData = { weight: Number(weight) }; 
        await updateDoc(userDocRef, newData);
      });        
      // Navigate to the next page (Height)
      navigation.navigate('height');
    } catch (error:any) {
      alert('Adding data has failed: ' + error.message);
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput 
        keyboardType='numeric'
        value={weight}
        style={styles.input} 
        placeholder='Weight (kg)' 
        autoCapitalize='none' 
        onChangeText={(text) => setWeight(text)}/>
        
      <Button onPress={() => navigation.navigate('age')} title="Go back"/>
      <Button onPress={() => handleData(weight)} title="Next"/>
    </View>
  )
}

export default Weight

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
      flex: 1,
      justifyContent: 'center'
    },
    input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
    }
  });