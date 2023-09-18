import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
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

  const [loading, setLoading] = useState(false);
  const {userID} = route.params as RouteParams;
  const [age, setAge] = useState("");
  const handleData =async (birthDate) => {
      setLoading(true);
      try {
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
            navigation.navigate('weight');
      }catch (error:any) {
      alert('Adding data has failed: ' + error.message);
      } finally{
      setLoading(false);
      }
  }

    const [birthDate, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
      };

      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };


      const showDatepicker = () => {
        showMode('date');
      };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={showDatepicker} title="Show date picker!" />
        <Text>selected: {birthDate.toLocaleDateString()}</Text>
        {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={birthDate}
                mode={mode}
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