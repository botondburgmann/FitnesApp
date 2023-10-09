import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setUpProfile } from '../functions/databaseQueries';
import Datepicker from '../components/Datepicker';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const Age = ({navigation}: RouterProps) => {
  const route = useRoute();

  const {userID} = route.params as RouteParams;
  
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const onChange = (selectedDate) => {
    const currentDate: Date = selectedDate || birthDate; 
    setShow(false);
    setBirthDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Please, select your date of birth</Text>
      <Datepicker date={birthDate} changeDate={date => setBirthDate(date)} />
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Gender')}>
          <Text style={styles.text}>Go back</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setUpProfile('age', birthDate, userID, navigation, 'Weight')}>
          <Text style={styles.text}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};


export default Age

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#ff0000'
 },

 text:{
   alignSelf: 'center',
   fontSize: 18,
   color: "#fff",
   textTransform: 'uppercase',
   fontWeight: "600",
   paddingVertical: 10,
 },
 button:{
     width: 100,
     paddingHorizontal: 5,
     marginHorizontal: 20,
     alignSelf: "center",
     backgroundColor: "#000",
 },

 label: {
     alignSelf: 'center',
     fontSize: 20,
     fontWeight: "800",
     color: "#fff",
     textTransform: 'uppercase',
     marginBottom: 50,
     marginHorizontal: 50,
     textAlign: 'center',
     lineHeight: 40
   },
   buttonGroup: {
    marginTop: 100,
    flexDirection: 'row'
   }
});