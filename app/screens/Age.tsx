import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const Age = ({navigation}: RouterProps) => {
  const route = useRoute();

  const {userID} = route.params as RouteParams;
  
  const handleData =async (birthDate) => {
    try {
      // Set the age field's value of the current's user's document      
      const usersCollection = collection(FIRESTORE_DB, 'users');
      const q = query(usersCollection, where("userID", '==', userID));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnapshot) => {
        const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);
        const today = new Date().getFullYear();      
        const age =  today-birthDate.getFullYear();      
        const newData = { age: age  }; 
        await updateDoc(userDocRef, newData);
      });     
         
      // Navigate to the next page (Weight)      
      navigation.navigate('weight');
    }
    catch (error:any) {
      alert('Adding data has failed: ' + error.message);
    }
  }

  const [birthDate, setBirthDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);
  const onChange = (selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setBirthDate(currentDate);
  };





  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={()=> {setShow(true)}} title="Show date picker!" />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate}
              mode='date'
              onChange={onChange}
            />
          )}

        <Button onPress={() => navigation.navigate('gender')} title="Go back"/>
        <Button onPress={() => handleData(birthDate)} title="Next"/>
    </View>
  )
}

export default Age

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