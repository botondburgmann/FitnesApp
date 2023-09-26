import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddWorkout: React.FC = () => {

 const [exercises, setExercises] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      let data: string[] = [];
      try {
        const exercisesCollection = collection(FIRESTORE_DB, 'Exercises');
        const q = query(exercisesCollection);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          data.push(docSnapshot.data().name); 
        });
        setExercises(data);
      } catch (error: any) {
        alert('Fetching data has failed: ' + error.message);
      }
    };

    getData();
  }, []); 

  const [accountContainerStyle, setAccountContainerStyle] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date; 
    setShow(false);
    setDate(currentDate);
  };

  function handleButtonClick(){

  }

  return (
    <View style={styles.container}>
        <View style={styles.navbar}>
            <Pressable style={styles.button} onPress={() =>setAccountContainerStyle(!accountContainerStyle)}>
                <Text style={styles.text}>Account</Text>
            </Pressable>
        </View>
        <View style={accountContainerStyle ? styles.accountContainerShown : styles.accountContainerHidden}>
            <Pressable style={styles.button}>
                <Text style={styles.text}>Profile Settings</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text} onPress={() => FIREBASE_AUTH.signOut()}>Logout</Text>
            </Pressable>
        </View>
        <Pressable style={styles.button} onPress={() => setShow(true)}>
                <Text style={styles.text}>Show date picker!</Text>
        </Pressable>
        {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                onChange={(event, selectedDate) => onChange(selectedDate)}
                />
            )}
        <Pressable style={styles.button}>
                <Text style={styles.text}>Add new set</Text>
        </Pressable>
    </View>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    navbar:{
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
        padding: 10,
        width: 100
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
      accountContainerShown:{
        display: 'flex',
        backgroundColor: '#1E2D3E',
        position: 'absolute',
        bottom: 35,
        right: 0,
        zIndex: 1,
        height: '100%',
        width: 200,
        justifyContent: 'flex-end'
      },
      accountContainerHidden:{
        display: 'none',
      }
  });