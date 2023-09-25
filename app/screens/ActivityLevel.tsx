import { View, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const ActivityLevel = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);
  const {userID} = route.params as RouteParams;

  const handleData =async (level) => {
    try {
      if (level === null)
        throw new Error("Please select one of the following levels");

      
      // Set the activityLevel field's value of the current's user's document      
      const usersCollection = collection(FIRESTORE_DB, 'users');
      const q = query(usersCollection, where("userID", '==',userID));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnapshot) => {
        const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);
        const newData = { activityLevel: level, set: true }; 
        await updateDoc(userDocRef, newData);
      });        
      
      // Navigate to the next page (Home)
      navigation.navigate('home');
    } catch (error:any) {
      alert('Adding data has failed: ' + error.message);
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      
      <Button onPress={() => navigation.navigate('height')} title="Go back"/>
      <Button onPress={() => handleData(value)} title="Complete"/>
    </View>
  )
}

export default ActivityLevel

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